import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


interface Idea {
  id: number;
  title: string;
  description: string;
  board?: { id: string };
  participant?: { id: number; displayName?: string };
}

@Component({
  selector: 'app-board',
  imports: [FormsModule],
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

  // hämta board namnet från backend
  boardName = "";

  // status 
  message = "";
  isSaving = false;

  // WebSocket-anslutningen till den aktuella boarden.
  private boardSocket?: WebSocket;


  constructor(private route: ActivatedRoute, private http: HttpClient, private cdr: ChangeDetectorRef) { }
  // Stänger WebSocket när användaren lämnar boarden.
  ngOnDestroy(): void {
    this.boardSocket?.close();
  }

  connectWebSocket(): void {
    if (!this.boardId) {
      return;
    }

    this.boardSocket = new WebSocket(
      `ws://localhost:8080/ws/boards/${encodeURIComponent(this.boardId)}`
    );

    // Tar emot händelser från backend.
    this.boardSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'IDEA_CREATED' && data.idea) {
          const newIdea = data.idea as Idea;

          // Hindra att samma ide läggs till flera gånger
          if (!this.ideas.some(idea => idea.id === newIdea.id)) {
            this.ideas = [...this.ideas, newIdea];
            this.cdr.detectChanges();
          }
        }
      } catch (error) {
        console.error('Kunde inte läsa WebSocket-meddelandet:', error);
      }
    };

    this.boardSocket.onerror = (error) => {
      console.error('WebSocket-fel:', error);
    };
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

  loadIdeas() {
    if (!this.boardId) {
      this.message = 'Board ID saknas';
      return;
    }

    this.http.get<Idea[]>(
      `http://localhost:8080/ideas/board/${encodeURIComponent(this.boardId)}`
    ).subscribe({
      next: (ideas) => {
        this.ideas = ideas;
      },
      error: (error) => {
        console.error('Kunde inte hämta idéer:', error);
        this.message = 'Det gick inte att hämta idéerna.';
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
    if (!participantId || !Number.isFinite(participantId)) {
      this.message = 'Deltagaruppgifter saknas. Gå med i boarden igen.';
      return;
    }

    this.message = '';
    this.isSaving = true;

    // Skicka idén till backend med boardens och deltagarens ID.
    this.http.post<Idea>('http://localhost:8080/ideas/create', {
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

      }
    });
  }

  // hämtar boardNamn från backend
  loadBoardName() {
    this.http.get<{ id: string; name: string }[]>(
      'http://localhost:8080/boards'
    ).subscribe({
      next: (boards) => {
        const board = boards.find(b => b.id === this.boardId);
        this.boardName = board?.name ?? 'boarden';

        // Ber Angular att uppdatera vyn.
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Kunde inte hämta boardens namn:', error);
        this.boardName = 'boarden';
        this.cdr.detectChanges();
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