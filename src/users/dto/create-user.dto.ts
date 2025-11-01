import { IsNotEmpty, IsOptional, IsString, Matches, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Número de WhatsApp (formato E.164)',
    example: '+5511999999999',
  })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'WhatsApp deve estar no formato E.164 (ex: +5511999999999)' })
  whatsapp: string;

  @ApiProperty({
    description: 'Código OTP (opcional, geralmente gerado automaticamente)',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  otpCode?: string;

  @ApiProperty({
    description: 'ID do plano do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  planId: string;
}
