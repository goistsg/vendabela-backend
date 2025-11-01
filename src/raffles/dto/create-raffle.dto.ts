import { IsString, IsOptional, IsDateString, IsBoolean, IsNumber, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRaffleDto {
  @ApiProperty({
    description: 'Título do sorteio',
    example: 'Sorteio de Natal',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Descrição do sorteio',
    example: 'Sorteio especial de fim de ano',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Data de início (ISO 8601)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Data de término (ISO 8601)',
    example: '2024-12-31T23:59:59Z',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Data do sorteio (ISO 8601)',
    example: '2025-01-01T10:00:00Z',
  })
  @IsDateString()
  drawDate: string;

  @ApiProperty({
    description: 'Número máximo de inscrições',
    example: 100,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxEntries?: number;

  @ApiProperty({
    description: 'Indica se o sorteio está ativo',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Descrição do prêmio',
    example: 'iPhone 15 Pro',
    required: false,
  })
  @IsOptional()
  @IsString()
  prize?: string;

  @ApiProperty({
    description: 'Valor do prêmio',
    example: 5000.00,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  prizeValue?: number;

  @ApiProperty({
    description: 'ID da empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  companyId: string;
}
