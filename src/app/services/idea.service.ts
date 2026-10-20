import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Idea, CreateIdeaRequest } from '../models/idea.model';

@Injectable({
    providedIn: 'root'
})
export class IdeaService {
    private readonly apiUrl = 'http://localhost:8080/ideas';

    constructor(private http: HttpClient) { }

    // Hämta idéer för en specifik board.
    getByBoard(boardId: string): Observable<Idea[]> {
        return this.http.get<Idea[]>(
            `${this.apiUrl}/board/${encodeURIComponent(boardId)}`
        );
    }

    // Skapa en ny idé.
    create(request: CreateIdeaRequest): Observable<Idea> {
        return this.http.post<Idea>(
            `${this.apiUrl}/create`,
            request
        );
    }

    // Ta bort en idé.
    delete(ideaId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${ideaId}`
        );
    }
}