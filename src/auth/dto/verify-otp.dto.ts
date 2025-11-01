import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Número de WhatsApp do usuário',
    example: '+5511999999999',
  })
  @IsString()
  @IsNotEmpty()
  whatsapp: string;

  @ApiProperty({
    description: 'Código OTP de 6 dígitos enviado via WhatsApp',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  otpCode: string;
}