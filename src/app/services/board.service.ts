import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BoardInfo {
    id: string;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class BoardService {
    private readonly apiUrl = 'http://localhost:8080/boards';

    constructor(private http: HttpClient) { }

    // Hämtar alla boards från backend.
    getAll(): Observable<BoardInfo[]> {
        return this.http.get<BoardInfo[]>(this.apiUrl);
    }
}