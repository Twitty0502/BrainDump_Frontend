
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BoardEvent } from '../models/board-event.model';
import { API_BASE_URL } from '../api.config';

@Injectable({
    providedIn: 'root'
})
export class BoardWebSocketService {

    // Anslut till WebSocket för en specifik board.
    //https://rxjs.dev/guide/observable
    connect(boardId: string): Observable<BoardEvent> {
        return new Observable((subscriber) => {
            if (!boardId) {
                subscriber.error(new Error('Board ID saknas'));
                return;
            }

            // Hämtar deltagarID från sessionStorage
            const participantId = sessionStorage.getItem('participantId');
            const websocketBaseUrl = API_BASE_URL.replace(/^http/, 'ws');

            // Ansluter till board och skickar med deltagarID
            const socket = new WebSocket(
                `${websocketBaseUrl}/ws/boards/${encodeURIComponent(boardId)}?participantId=${encodeURIComponent(participantId ?? '')}`
            );

            socket.onmessage = (event) => {
                try {
                    // Gör meddelandet till en WebSocket-händelse.
                    const data = JSON.parse(event.data) as BoardEvent;
                    subscriber.next(data);
                } catch (error) {
                    console.error(
                        'Kunde inte läsa WebSocket-meddelandet:',
                        error
                    );
                }
            };

            socket.onerror = (error) => {
                subscriber.error(error);
            };

            socket.onclose = () => {
                subscriber.complete();
            };

            // Stäng anslutningen när subscriben avslutas.
            // Källa: RxJS – Observable och MDN – WebSocket.close()
            // https://rxjs.dev/guide/observable
            // https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close
            return () => {
                if (
                    socket.readyState === WebSocket.CONNECTING ||
                    socket.readyState === WebSocket.OPEN
                ) {
                    socket.close();
                }
            };
        });
    }
}
