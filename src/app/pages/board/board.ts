import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-board',
  imports: [],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board implements OnInit {

  boardId = '';
  displayName = '';

  constructor(private route: ActivatedRoute) { }

  // Hämtar boardens ID från URL:en och sparar det i boardId.
  // Om ID saknas används en tom sträng. ID:t används för att hämta rätt board från backend.
  ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('id') ?? '';

    this.displayName = sessionStorage.getItem('participantName') ?? '';
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