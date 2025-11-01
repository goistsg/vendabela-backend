export interface CreateTestSessionDto {
    testerName: string;
    whatsapp?: string;
    context?: Record<string, any>; // Ex: { browser: "Chrome", version: "1.0.0" }
}