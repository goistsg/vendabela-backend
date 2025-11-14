import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Produto Exemplo',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Categoria do produto',
    example: 'Eletrônicos',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'SKU do produto',
    example: 'PROD-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Descrição detalhada do produto',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Ingredientes do produto',
    example: ['Ingrediente 1', 'Ingrediente 2'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @ApiProperty({
    description: 'URLs das imagens do produto',
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @ApiProperty({
    description: 'Recomendações de uso',
    example: ['Recomendação 1', 'Recomendação 2'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recommendations?: string[];

  @ApiProperty({
    description: 'Notas de uso do produto',
    example: 'Instruções de uso detalhadas',
    required: false,
  })
  @IsOptional()
  @IsString()
  usageNotes?: string;

  @ApiProperty({
    description: 'Preço de custo',
    example: 50.00,
    type: Number,
  })
  @IsNumber()
  costPrice: number;
  
  @ApiProperty({
    description: 'Último preço',
    example: 80.00,
    type: Number,
  })
  @IsNumber()
  lastPrice: number;

  @ApiProperty({
    description: 'Preço de venda',
    example: 100.00,
    type: Number,
  })
  @IsNumber()
  salePrice: number;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 100,
    type: Number,
  })
  @IsNumber()
  stock: number;

  @ApiProperty({
    description: 'Indica se o produto tem amostra',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasSample?: boolean;

  @ApiProperty({
    description: 'Quantidade de amostras disponíveis',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  sampleQuantity?: number;

  @ApiProperty({
    description: 'ID da empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  companyId: string;
}