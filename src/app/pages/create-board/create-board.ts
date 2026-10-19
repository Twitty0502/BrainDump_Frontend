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

  boardName = '';
  message = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  createBoard() {
    const name = this.boardName.trim();

    if (!name) {
      return;
    }

    this.http.post<{ id: string; name: string }>(
      'http://localhost:8080/boards/create',
      { name }
    ).subscribe({
      next: (board) => {
        this.router.navigate(['/board', board.id]);
      },
      error: (error) => {
        console.error('Kunde inte skapa board:', error);
        this.message = 'Det gick inte att skapa boarden. Försök igen.';
      }
    });
  }
}