import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-board',
  imports: [RouterLink, FormsModule],
  templateUrl: './create-board.html',
  styleUrl: './create-board.css',
})
export class CreateBoard {

  // titeln från inputfältet
  boardName = '';
  // visningsnamnet från inputfältet
  displayName = '';
  // eventuellt felmeddelande
  message = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  createBoard() {
    const name = this.boardName.trim();
    const displayName = this.displayName.trim();

    // tillåter inte tomma titlar
    if (!name || !displayName) {
      this.message = 'Både Boardens titel och visningsnamn måste fyllas i.';
      return;
    }
    // Skapa ny board
    this.http.post<{ id: string; name: string }>(
      'http://localhost:8080/boards/create',
      { name }
    ).subscribe({

      // Ifall skapandet lyckas, navigera till den nya boarden genom ID
      next: (board) => {
        this.http.post<{ id: number; displayName: string }>(
          `http://localhost:8080/boards/${encodeURIComponent(board.id)}/participants`,
          { displayName }
        ).subscribe({
          // Spara deltagarens uppgifter under den aktuella sessionen.
          next: (participant) => {
            sessionStorage.setItem('participantId', String(participant.id));
            sessionStorage.setItem('participantName', participant.displayName);
            sessionStorage.setItem('boardId', board.id);
            this.router.navigate(['/board', board.id]);
          },
          error: (error) => {
            console.error('Kunde inte skapa board:', error);
            this.message = 'Det gick inte att skapa boarden. Försök igen.';
          }
        });
      }
    })
  }
}