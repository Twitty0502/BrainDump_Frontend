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

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('id') ?? '';
  }
}