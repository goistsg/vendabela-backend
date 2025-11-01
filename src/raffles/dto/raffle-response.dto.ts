export class RaffleResponseDto {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  drawDate: Date;
  maxEntries?: number;
  isActive: boolean;
  isDrawn: boolean;
  prize?: string;
  prizeValue?: number;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  userId: string;
  entriesCount?: number;
}
