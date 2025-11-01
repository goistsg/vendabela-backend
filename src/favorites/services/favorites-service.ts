import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductFavoriteDto } from '../dto/product-favorite.dto';
import { FavoriteResponseDto } from '../dto/favorite-response.dto';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: ProductFavoriteDto): Promise<FavoriteResponseDto> {
    // Verificar se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: { company: true }
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${dto.productId} não encontrado`);
    }

    // Verificar se já existe um favorito para este produto e usuário
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: dto.productId
        }
      }
    });

    if (existingFavorite) {
      throw new ConflictException('Este produto já está nos seus favoritos');
    }

    const favorite = await this.prisma.favorite.create({
      data: {
        userId,
        productId: dto.productId,
        companyId: product.companyId
      },
      include: {
        product: true,
        company: true
      }
    });

    return {
      id: favorite.id,
      userId: favorite.userId,
      companyId: favorite.companyId,
      productId: favorite.productId,
      createdAt: favorite.createdAt,
      product: {
        id: favorite.product.id,
        name: favorite.product.name,
        description: favorite.product.description,
        price: favorite.product.salePrice,
        imageUrl: favorite.product.imageUrls[0] || null
      },
      company: {
        id: favorite.company.id,
        name: favorite.company.name
      }
    };
  }

  async findAll(userId: string, companyId: string): Promise<FavoriteResponseDto[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId, companyId },
      include: {
        product: true,
        company: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return favorites.map(favorite => ({
      id: favorite.id,
      userId: favorite.userId,
      companyId: favorite.companyId,
      productId: favorite.productId,
      createdAt: favorite.createdAt,
      product: {
        id: favorite.product.id,
        name: favorite.product.name,
        description: favorite.product.description,
        price: favorite.product.salePrice,
        imageUrl: favorite.product.imageUrls[0] || null
      },
      company: {
        id: favorite.company.id,
        name: favorite.company.name
      }
    }));
  }

  async remove(userId: string, dto: ProductFavoriteDto): Promise<void> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: dto.productId
        }
      }
    });

    if (!favorite) {
      throw new NotFoundException('Favorito não encontrado');
    }

    await this.prisma.favorite.delete({
      where: {
        userId_productId: {
          userId,
          productId: dto.productId
        }
      }
    });
  }
}