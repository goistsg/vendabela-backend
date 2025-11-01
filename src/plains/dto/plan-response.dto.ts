export class PlanResponseDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  features?: any;
  isInternal: boolean;
  createdAt: Date;
  updatedAt: Date;
  usersCount?: number; // Número de usuários usando este plano
}
