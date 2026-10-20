
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BoardEvent } from '../models/board-event.model';

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

            const socket = new WebSocket(
                `ws://localhost:8080/ws/boards/${encodeURIComponent(boardId)}`
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
