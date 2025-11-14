import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class SellerResponseDto {
  @ApiProperty({
    description: 'Resposta do vendedor à avaliação',
    example: 'Obrigado pelo feedback! Ficamos felizes que tenha gostado do produto.',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @MinLength(10, { message: 'Resposta deve ter no mínimo 10 caracteres' })
  @MaxLength(500, { message: 'Resposta deve ter no máximo 500 caracteres' })
  response: string;
}

