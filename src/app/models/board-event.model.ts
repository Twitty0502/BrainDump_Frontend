import { Idea } from './idea.model';

// Vid skapande av ny idé
export interface IdeaCreatedEvent {
    type: 'IDEA_CREATED';
    idea: Idea;
}

// När en idé tas bort
export interface IdeaDeletedEvent {
    type: 'IDEA_DELETED';
    ideaId: number;
    boardId: string;
}

// När en board rensas
export interface BoardClearedEvent {
    type: 'BOARD_CLEARED';
    boardId: string;
}

// Alla WebSocket-"event"
export type BoardEvent =
    | IdeaCreatedEvent
    | IdeaDeletedEvent
    | BoardClearedEvent;