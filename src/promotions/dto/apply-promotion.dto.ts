import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class ApplyPromotionDto {
  @ApiProperty({
    description: 'ID da promoção',
    example: 'promotion-uuid',
  })
  @IsUUID()
  promotionId: string;

  @ApiProperty({
    description: 'ID do pedido',
    example: 'order-uuid',
  })
  @IsUUID()
  orderId: string;

  @ApiPropertyOptional({
    description: 'Código do cupom (se aplicável)',
    example: 'BLACKFRIDAY2024',
  })
  @IsOptional()
  @IsString()
  code?: string;
}

