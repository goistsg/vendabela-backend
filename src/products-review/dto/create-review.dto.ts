import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsArray,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'ID do produto sendo avaliado',
    example: 'uuid-do-produto',
  })
  @IsUUID()
  productId: string;

  @ApiPropertyOptional({
    description: 'ID do pedido (para verificar compra)',
    example: 'uuid-do-pedido',
  })
  @IsOptional()
  @IsUUID()
  orderId?: string;

  @ApiProperty({
    description: 'Nota de 1 a 5 estrelas',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    description: 'Título da avaliação',
    example: 'Produto excelente!',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiProperty({
    description: 'Comentário detalhado',
    example: 'Produto de ótima qualidade, superou minhas expectativas...',
    minLength: 10,
    maxLength: 1000,
  })
  @IsString()
  @MinLength(10, { message: 'Comentário deve ter no mínimo 10 caracteres' })
  @MaxLength(1000, { message: 'Comentário deve ter no máximo 1000 caracteres' })
  comment: string;

  @ApiPropertyOptional({
    description: 'URLs das imagens da avaliação',
    example: ['https://exemplo.com/imagem1.jpg', 'https://exemplo.com/imagem2.jpg'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

