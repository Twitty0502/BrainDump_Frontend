import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';

export interface BoardInfo {
    id: string;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class BoardService {
    private readonly apiUrl = `${API_BASE_URL}/boards`;

    constructor(private http: HttpClient) { }

    // Hämtar alla boards från backend.
    // Källa: https://rxjs.dev/guide/observable
    getAll(): Observable<BoardInfo[]> {
        return this.http.get<BoardInfo[]>(this.apiUrl);
    }
}