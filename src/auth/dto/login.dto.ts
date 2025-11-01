import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Número de WhatsApp do usuário',
    example: '+5511999999999',
  })
  @IsString()
  @IsNotEmpty()
  whatsapp: string;
}