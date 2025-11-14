import { IsNotEmpty, IsOptional, IsString, Matches, IsEmail, MinLength } from 'class-validator';
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
    description: 'Email do usuário',
    example: 'joao@exemplo.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 8 caracteres, deve conter maiúscula, minúscula e número/caractere especial)',
    example: 'Senha@123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha deve conter maiúscula, minúscula e número/caractere especial',
  })
  password: string;

  @ApiProperty({
    description: 'Número de WhatsApp (formato E.164)',
    example: '+5511999999999',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'WhatsApp deve estar no formato E.164 (ex: +5511999999999)' })
  whatsapp?: string;
}
