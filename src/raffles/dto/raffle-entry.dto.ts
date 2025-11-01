import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRaffleEntryDto {
  @ApiProperty({
    description: 'ID do cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  clientId: string;
}

export class RaffleEntryResponseDto {
  id: string;
  clientId: string;
  raffleId: string;
  entryDate: Date;
  isWinner: boolean;
  client?: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
  };
}
