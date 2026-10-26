export interface Idea {
    id: number;
    title: string;
    description: string;
    board?: { id: string };
    categories:
    | 'NEW_IDEA'
    | 'IMPROVEMENT'
    | 'PROBLEM_SOLVING'
    | 'PROCESS_AND_WAYS_OF_WORKING'
    | 'ACTIVITY_AND_PROJECT'
    | 'CONTENT_AND_COMMUNICATION'
    | 'OTHER';
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