export interface FeedbackResponseDto {
    id: string;
    testerName: string;
    whatsapp?: string;
    screen?: string;
    worked?: boolean;
    description?: string;
    improvementSuggestion?: string;
    untestedReason?: string;
    createdAt: string;
    updatedAt: string;
}