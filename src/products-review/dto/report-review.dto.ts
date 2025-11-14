import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class ReportReviewDto {
  @ApiProperty({
    description: 'Motivo da denúncia',
    example: 'Conteúdo ofensivo',
    minLength: 5,
    maxLength: 200,
  })
  @IsString()
  @MinLength(5, { message: 'Motivo deve ter no mínimo 5 caracteres' })
  @MaxLength(200, { message: 'Motivo deve ter no máximo 200 caracteres' })
  reason: string;
}

