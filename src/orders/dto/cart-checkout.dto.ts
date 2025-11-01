import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CartCheckoutDto {
  @ApiProperty({
    description: 'ID do carrinho',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  cartId: string;

  @ApiProperty({
    description: 'Número do endereço',
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  addressNumber: string;
}