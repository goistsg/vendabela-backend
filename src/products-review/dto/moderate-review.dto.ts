import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum ReviewModerationStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
}

export class ModerateReviewDto {
  @ApiProperty({
    description: 'Novo status da avaliação',
    enum: ReviewModerationStatus,
    example: ReviewModerationStatus.APPROVED,
  })
  @IsEnum(ReviewModerationStatus)
  status: ReviewModerationStatus;

  @ApiPropertyOptional({
    description: 'Motivo da moderação (especialmente para rejeição)',
    example: 'Conteúdo inadequado',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

