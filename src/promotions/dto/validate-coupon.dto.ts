import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @ApiProperty({ example: 'product-uuid' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 'Eletrônicos' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 99.90 })
  @IsNumber()
  @Min(0)
  price: number;
}

export class ValidateCouponDto {
  @ApiProperty({
    description: 'Código do cupom',
    example: 'BLACKFRIDAY2024',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Valor total do pedido',
    example: 250.50,
  })
  @IsNumber()
  @Min(0)
  orderTotal: number;

  @ApiPropertyOptional({
    description: 'ID da empresa (para validação multi-tenant)',
    example: 'company-uuid',
  })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiProperty({
    description: 'Itens do pedido',
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}

