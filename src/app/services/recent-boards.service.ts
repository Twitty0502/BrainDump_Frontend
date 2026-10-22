import { Injectable } from "@angular/core";
import { RecentBoard } from "../models/recent-board.model";

@Injectable({
    providedIn: 'root'
})
export class RecentBoardsService {

    // Hämtar nyckel baserad på deltagarID.
    private getStorageKey(): string {
        const participantId = sessionStorage.getItem('participantId');
        // Om deltagarID finns, skapa lista
        return participantId
            ? `recentBoards_${participantId}`
            : 'recentBoards';
    }

    // Hämtar senast besökt board från localStorage
    getRecentBoards(): RecentBoard[] {
        const saved = localStorage.getItem(this.getStorageKey());

        // Ifall ingen lista sparats, returnera tom
        if (!saved) {
            return [];
        }
        // Omvandla JSON till lista (RecentBoard)
        try {
            return JSON.parse(saved) as RecentBoard[];
        } catch {
            return [];
        }
    }

    // Registrera att en board har besökts
    recordVisit(id: string, name: string): void {
        // Hämta senast sparade boarden
        const updatedBoards = [{
            id,
            name,
            visitedAt: Date.now()
        }];

        // Spara den senaste boarden i localStorage.
        localStorage.setItem(
            this.getStorageKey(),
            JSON.stringify(updatedBoards)
        );
    }
}