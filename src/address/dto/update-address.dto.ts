import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateAddressDto {
  @ApiProperty({ description: 'Nome/apelido do endereço', example: 'Casa', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Rua/Avenida', example: 'Rua das Flores', required: false })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({ description: 'Número do endereço', example: '123', required: false })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiProperty({ description: 'Complemento', example: 'Apto 101', required: false })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({ description: 'Bairro', example: 'Centro', required: false })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({ description: 'Cidade', example: 'São Paulo', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'Estado (UF)', example: 'SP', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'CEP', example: '01310-100', required: false })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({ description: 'Latitude', example: -23.5505199, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ description: 'Longitude', example: -46.6333094, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ description: 'Indica se é o endereço principal', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiProperty({ description: 'ID do cliente', example: '123e4567-e89b-12d3-a456-426614174000', format: 'uuid', required: false })
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value) // Transforma string vazia em undefined
  @IsString()
  @IsUUID()
  clientId?: string;
}
