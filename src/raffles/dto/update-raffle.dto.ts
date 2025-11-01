import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRaffleDto {
    @ApiProperty({ description: 'Título do sorteio', example: 'Sorteio de Natal', required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ description: 'Descrição do sorteio', example: 'Sorteio especial', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Data de início (ISO 8601)', example: '2024-01-01T00:00:00Z', required: false })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiProperty({ description: 'Data de término (ISO 8601)', example: '2024-12-31T23:59:59Z', required: false })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiProperty({ description: 'Data do sorteio (ISO 8601)', example: '2025-01-01T10:00:00Z', required: false })
    @IsOptional()
    @IsDateString()
    drawDate?: string;

    @ApiProperty({ description: 'Número máximo de inscrições', example: 100, type: Number, required: false })
    @IsOptional()
    @IsNumber()
    maxEntries?: number;

    @ApiProperty({ description: 'Indica se o sorteio está ativo', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
