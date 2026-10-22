import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';

// services and models
import { IdeaService } from '../../services/idea.service';
import { Idea } from '../../models/idea.model';
import { BoardWebSocketService } from '../../services/board-websocket.service';
import { BoardService } from '../../services/board.service';
import { BoardEvent } from '../../models/board-event.model';
import { AiAssistant } from './components/ai-assistant/ai-assistant';
import { RecentBoardsService } from '../../services/recent-boards.service';
@Component({
  selector: 'app-board',
  imports: [FormsModule, AiAssistant],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board implements OnInit, OnDestroy {

  // vid skapande av board
  boardId = '';
  displayName = '';

  // vid skapande av idé
  ideaTitle = "";
  ideaDescription = "";

  // lista idéer från backend
  ideas: Idea[] = [];
  private ideasLoaded = false;

  // hämta board namnet från backend
  boardName = "";

  // status 
  message = "";
  isSaving = false;

  // Anslutna deltagare
  participants: string[] = [];

  // WebSocket-anslutningen till den aktuella boarden.
  private boardSubscription?: Subscription;

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private ideaService: IdeaService, private boardWebSocketService: BoardWebSocketService, private boardService: BoardService, private recentBoardsService: RecentBoardsService
  ) { }
  // Stänger WebSocket när användaren lämnar boarden.
  ngOnDestroy(): void {
    this.boardSubscription?.unsubscribe();
  }

  connectWebSocket(): void {
    if (!this.boardId) {
      return;
    }

    this.boardSubscription = this.boardWebSocketService
      .connect(this.boardId)
      .subscribe({
        next: (data: BoardEvent) => {
          switch (data.type) {
            case 'IDEA_CREATED':
              // Lägg bara till idén om den inte redan finns.
              if (!this.ideas.some(idea => idea.id === data.idea.id)) {
                this.ideas = [...this.ideas, data.idea];
                this.cdr.detectChanges();
              }
              break;

            case 'IDEA_DELETED':
              // Ta bort idén från listan.
              this.ideas = this.ideas.filter(
                idea => idea.id !== data.ideaId
              );
              this.cdr.detectChanges();
              break;

            case 'BOARD_CLEARED':
              // Töm listan när alla idéer har tagits bort.
              this.ideas = [];
              this.cdr.detectChanges();
              break;

            case 'PARTICIPANTS_UPDATED':
              // Sparar den uppdaterade listan av anslutna deltagare
              this.participants = data.participants;
              this.cdr.detectChanges();
              break;
          }
        },
        error: (error) => {
          console.error('WebSocket-fel:', error);
        }
      });
  }

  // Hämtar boardens ID från URL:en och sparar det i boardId.
  // Om ID saknas används en tom sträng. ID:t används för att hämta rätt board från backend.
  ngOnInit() {
    // hämta boardens ID från URL:en
    this.boardId = this.route.snapshot.paramMap.get('id') ?? '';

    // hämta namnet på deltagaren från sessionStorage
    this.displayName = sessionStorage.getItem('participantName') ?? '';

    // Anslut till WebSocket för den aktuella boarden.
    this.connectWebSocket();

    // hämta idéerna som tillhör den specifika boarden
    this.loadIdeas();

    // hämta namnet på boarden
    this.loadBoardName();
  }

  loadIdeas(): void {
    if (!this.boardId) {
      this.message = 'Board ID saknas';
      return;
    }

    this.ideaService.getByBoard(this.boardId).subscribe({
      next: (ideas) => {
        // Behåll både idéerna som hämtas från backend och de som redan
        // har lagts till i listan, så att ingen idé skrivs över.        
        const combinedIdeas = [...ideas, ...this.ideas];

        this.ideas = combinedIdeas.filter(
          (idea, index, allIdeas) =>
            allIdeas.findIndex(item => item.id === idea.id) === index
        );

        this.ideasLoaded = true;

        // Be angular uppdatera innehållet på sidan
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Kunde inte hämta idéer:', error);
        this.message = 'Det gick inte att hämta idéerna.';

        // Be angular uppdatera innehållet på sidan
        this.cdr.detectChanges();
      }
    });
  }

  // Skapar en ny idé och kopplar den till boarden och deltagaren.
  createIdea() {
    const title = this.ideaTitle.trim();
    const description = this.ideaDescription.trim();
    const participantId = Number(sessionStorage.getItem('participantId'));

    // Kontrollera att en titel har angetts.
    if (!title) {
      this.message = 'Skriv en titel för idén.';
      return;
    }

    // Kontrollera att deltagarens ID finns.
    // // Avbryt skapandet av idén om ID:t saknas, är 0 eller inte är
    // ett ändligt tal, till exempel NaN eller Infinity.
    // Källa: MDN Web Docs – Number.isFinite() och Logical NOT (!)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT
    if (!participantId || !Number.isFinite(participantId)) {
      this.message = 'Deltagaruppgifter saknas. Gå med i boarden igen.';
      return;
    }

    this.message = '';
    this.isSaving = true;

    // Skicka idén till backend med boardens och deltagarens ID.
    this.ideaService.create({
      title,
      description,
      board: { id: this.boardId },
      participant: { id: participantId }
    }).subscribe({
      next: (createdIdea) => {
        // Lägg till den skapade idén direkt i listan.
        // lägg endast till idén om den inte redan kommit in via ws
        if (!this.ideas.some(idea => idea.id === createdIdea.id)) {
          this.ideas = [...this.ideas, createdIdea];
        }

        // Töm formuläret efter att idén har sparats.
        this.ideaTitle = '';
        this.ideaDescription = '';
        this.isSaving = false;
        this.message = 'Idén har sparats!';
        this.cdr.detectChanges();

      },
      error: (error) => {
        console.error('Kunde inte skapa idén:', error);
        this.isSaving = false;
        this.message = 'Det gick inte att spara idén. Försök igen.';
        this.cdr.detectChanges();
      }
    });
  }

  // hämtar boardNamn från backend
  loadBoardName(): void {
    this.boardService.getAll().subscribe({
      next: (boards) => {
        const board = boards.find(board => board.id === this.boardId);
        this.boardName = board?.name ?? 'boarden';
        this.recentBoardsService.recordVisit(this.boardId, this.boardName);
        // be angular uppdatera vyn
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Kunde inte hämta boardens namn:', error);
        this.boardName = 'boarden';
        this.cdr.detectChanges();
      }
    });
  }

  // Ta bort idé genom ID
  deleteIdea(ideaId: number) {

    this.ideaService.delete(ideaId).subscribe({
      next: () => {
        // Borttagning lyckades
      },
      error: (error) => {
        console.error('Idén kunde inte raderas, error');
      }
    });
  }

  // Kopierar boardens ID till urklipp.
  async copyBoardId() {
    try {
      await navigator.clipboard.writeText(this.boardId);
    } catch (error) {
      console.error('Kunde inte kopiera board-ID:', error);
    }
  }
}