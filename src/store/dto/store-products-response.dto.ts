import { ApiProperty } from '@nestjs/swagger';
import { StoreProductDto } from './store-product.dto';
import { PaginationDto } from './pagination.dto';

/**
 * DTO de resposta para lista paginada de produtos da loja
 */
export class StoreProductsResponseDto {
  @ApiProperty({
    description: 'Lista de produtos',
    type: [StoreProductDto],
  })
  data: StoreProductDto[];

  @ApiProperty({
    description: 'Informações de paginação',
    type: PaginationDto,
  })
  pagination: PaginationDto;
}

