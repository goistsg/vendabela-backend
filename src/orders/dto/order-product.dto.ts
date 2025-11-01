import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderProductDto {
  @ApiProperty({
    description: 'ID do produto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  productId: string;
  
  @ApiProperty({
    description: 'Quantidade do produto',
    example: 2,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
  
  @ApiProperty({
    description: 'Preço unitário do produto',
    example: 100.00,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
