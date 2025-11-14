import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { IsString } from 'class-validator';

/**
 * DTO de resposta para produto da loja
 * Representa um produto disponível na loja pública
 */
export class StoreProductDto {
  @ApiProperty({
    description: 'ID único do produto',
    example: '91db60be-bad5-4d40-85fb-93d73a5fb966',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do produto',
    example: 'Baunilha com Morango',
  })
  name: string;

  @ApiProperty({
    description: 'Categoria do produto (nome da categoria como string)',
    example: 'Baunilha',
    nullable: true,
  })
  category: string | null;

  @ApiProperty({
    description: 'SKU (código único) do produto',
    example: 'BMS003',
    nullable: true,
  })
  sku: string | null;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Delicioso bolo de baunilha com morangos frescos',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Ingredientes do produto',
    example: ['Ingrediente 1', 'Ingrediente 2'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @ApiProperty({
    description: 'Array de URLs das imagens do produto',
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    type: [String],
  })
  imageUrls: string[];

  @ApiProperty({
    description: 'Preço de venda do produto',
    example: 14.9,
  })
  salePrice: number;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 15,
  })
  stock: number;

  @ApiProperty({
    description: 'Indica se o produto possui amostra disponível',
    example: false,
  })
  hasSample: boolean;

  @ApiProperty({
    description: 'Data de criação do produto',
    example: '2025-11-04T02:44:43.975Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do produto',
    example: '2025-11-04T02:46:08.525Z',
  })
  updatedAt: Date;
}

/**
 * DTO de resposta para produto detalhado da loja
 * Inclui informações adicionais como recomendações e notas de uso
 */
export class StoreProductDetailDto extends StoreProductDto {
  @ApiProperty({
    description: 'Array de IDs de produtos recomendados',
    example: ['product-id-1', 'product-id-2'],
    type: [String],
  })
  recommendations: string[];

  @ApiProperty({
    description: 'Notas de uso do produto',
    example: 'Conservar em local fresco e seco',
    nullable: true,
  })
  usageNotes: string | null;

  @ApiProperty({
    description: 'Preço de custo do produto',
    example: 10.0,
  })
  costPrice: number;

  @ApiProperty({
    description: 'Último preço registrado',
    example: 14.9,
  })
  lastPrice: number;

  @ApiProperty({
    description: 'Quantidade de amostra disponível',
    example: 5,
    nullable: true,
  })
  sampleQuantity: number | null;
}

