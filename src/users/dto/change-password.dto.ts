import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Senha atual do usuário',
    example: 'SenhaAtual@123',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description: 'Nova senha (mínimo 8 caracteres, deve conter maiúscula, minúscula e número/caractere especial)',
    example: 'NovaSenha@123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha deve conter maiúscula, minúscula e número/caractere especial',
  })
  newPassword: string;
}

