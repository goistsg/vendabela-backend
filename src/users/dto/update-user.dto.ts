import { IsNotEmpty, IsOptional, IsString, Matches, IsUUID, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@exemplo.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Número de WhatsApp (formato E.164)',
    example: '+5511999999999',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'WhatsApp deve estar no formato E.164 (ex: +5511999999999)' })
  whatsapp?: string;

  @ApiProperty({
    description: 'Código OTP',
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
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  planId?: string;
}
