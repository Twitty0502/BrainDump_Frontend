import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-join-board',
  imports: [RouterLink, FormsModule],
  templateUrl: './join-board.html',
  styleUrl: './join-board.css',
})
export class JoinBoard {

  // uppgifter användaren fyller i inputfältet
  boardId = '';
  displayName = '';

  // eventuellt felmeddelande 
  message = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  joinBoard() {
    // Trimma bort möjliga mellanslag i början och slutet 
    const id = this.boardId.trim();
    const name = this.displayName.trim();

    // tillåter inte tomma fält
    if (!id || !name) {
      this.message = 'Både Board ID och visningsnamn måste fyllas i.';
      return;
    }

    // Källa: MDN Web Docs – encodeURIComponent()
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
    // Källa: Angular – HttpClient
    // https://angular.dev/api/common/http/HttpClient
    this.http.post<{ id: number; displayName: string }>(
      // encode ser till att ID kodas för att skapa säker URL, t.ex. om ID innehåller mellanslag eller specialtecken.
      `http://localhost:8080/boards/${encodeURIComponent(id)}/participants`,
      // skicka visningsnamn till backend
      { displayName: name }
    ).subscribe({
      next: (participant) => {
        // Spara deltagarens uppgifter så att de kan användas på board-sidan.
        sessionStorage.setItem('participantId', String(participant.id));
        sessionStorage.setItem('participantName', participant.displayName);
        sessionStorage.setItem('boardId', id);

        // Öppna boarden som användaren anslöt till.
        this.router.navigate(['/board', id]);
      },
      error: (error) => {
        console.error('Kunde inte ansluta till boarden:', error);

        this.message = error.status === 404
          ? 'Boarden kunde inte hittas.'
          : 'Det gick inte att ansluta. Kontrollera board-ID:t och försök igen.';
      }
    });
  }
}