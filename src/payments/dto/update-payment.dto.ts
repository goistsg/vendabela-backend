import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';

export class UpdatePaymentDto {
  @ApiProperty({
    description: 'Status do pagamento',
    enum: PaymentStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

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
