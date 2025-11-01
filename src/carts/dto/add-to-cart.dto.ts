import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({
    description: 'ID do produto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Quantidade do produto',
    example: 2,
    type: Number,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Variante do produto',
    example: 'Cor: Vermelho, Tamanho: G',
    required: false,
  })
  @IsString()
  @IsOptional()
  variant?: string;
}
