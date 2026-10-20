export interface Idea {
    id: number;
    title: string;
    description: string;
    board?: { id: string };
    participant?: {
        id: number;
        displayName?: string;
    };
}

export interface CreateIdeaRequest {
    title: string;
    description: string;
    board: { id: string };
    participant: { id: number };
}