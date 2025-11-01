import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID do pedido',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  orderId: string;

  @ApiProperty({
    description: 'Método de pagamento',
    enum: PaymentMethod,
    example: PaymentMethod.PIX,
  })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({
    description: 'Código QR Code (para PIX)',
    example: '00020126360014BR.GOV.BCB.PIX0114+5511999999999...',
    required: false,
  })
  @IsOptional()
  @IsString()
  qrCode?: string;

  @ApiProperty({
    description: 'Payload PIX',
    example: 'pixPayload...',
    required: false,
  })
  @IsOptional()
  @IsString()
  pixPayload?: string;
}
