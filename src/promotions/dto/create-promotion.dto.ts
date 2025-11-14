import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsDateString,
  Min,
  Max,
  MaxLength,
  IsInt,
} from 'class-validator';
import { PromotionType } from '@prisma/client';

export class CreatePromotionDto {
  @ApiProperty({
    description: 'Nome da promoção',
    example: 'Black Friday 2024',
  })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da promoção',
    example: '30% de desconto em todo o site',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'Tipo de promoção',
    enum: PromotionType,
    example: PromotionType.PERCENTAGE,
  })
  @IsEnum(PromotionType)
  type: PromotionType;

  @ApiProperty({
    description: 'Valor do desconto (% ou R$)',
    example: 30,
  })
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiPropertyOptional({
    description: 'Valor máximo de desconto (para descontos percentuais)',
    example: 200,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number;

  @ApiPropertyOptional({
    description: 'Código do cupom (ex: BLACKFRIDAY2024)',
    example: 'BLACKFRIDAY2024',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @ApiPropertyOptional({
    description: 'Se true, o código é obrigatório',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isCouponRequired?: boolean;

  @ApiProperty({
    description: 'Data de início da promoção (ISO 8601)',
    example: '2024-11-25T00:00:00Z',
  })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    description: 'Data de fim da promoção (ISO 8601)',
    example: '2024-11-30T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Se a promoção está ativa',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Limite total de usos',
    example: 1000,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  usageLimit?: number;

  @ApiPropertyOptional({
    description: 'Limite de usos por usuário',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  usageLimitPerUser?: number;

  @ApiPropertyOptional({
    description: 'Valor mínimo de compra',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPurchaseAmount?: number;

  @ApiPropertyOptional({
    description: 'Quantidade mínima de itens',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  minQuantity?: number;

  @ApiPropertyOptional({
    description: 'IDs dos produtos aplicáveis',
    example: ['uuid-1', 'uuid-2'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableProductIds?: string[];

  @ApiPropertyOptional({
    description: 'Categorias aplicáveis',
    example: ['Eletrônicos', 'Informática'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableCategories?: string[];

  @ApiPropertyOptional({
    description: 'IDs das empresas aplicáveis (multi-tenant)',
    example: ['company-uuid'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableCompanyIds?: string[];

  @ApiPropertyOptional({
    description: 'Apenas para primeira compra',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFirstPurchaseOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Oferece frete grátis',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFreeShipping?: boolean;

  @ApiPropertyOptional({
    description: 'Pode acumular com outras promoções',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  canStackWithOthers?: boolean;

  @ApiPropertyOptional({
    description: 'Prioridade de aplicação (maior = aplica primeiro)',
    example: 10,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  priority?: number;

  @ApiPropertyOptional({
    description: 'BOGO: Quantidade para comprar',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  buyQuantity?: number;

  @ApiPropertyOptional({
    description: 'BOGO: Quantidade que leva',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  getQuantity?: number;
}

