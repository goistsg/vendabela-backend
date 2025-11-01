export interface CreateUserFeedbackDto {
    sessionId?: string; // opcional — caso seja teste
    testerName: string;
    whatsapp?: string;
    screen?: string; // nome da tela/funcionalidade
    worked?: boolean;
    description?: string;
    improvementSuggestion?: string;
    untestedReason?: string;
    userId?: string; // opcional — usado no modo produção
}