import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto, userId?: string) {
    if (!userId) {
      throw new NotFoundException(`userId é obrigatório para criar produtos`);
    }

    return this.prisma.product.create({ 
      data: {
        ...dto,
        userId: userId
      },
      include: { 
        company: true,
        user: true
      }
    });
  }

  async findAll(userId?: string) {   
    const whereClause = userId ? { userId } : {};

    return this.prisma.product.findMany({
      where: whereClause,
      include: { 
        company: true,
        user: true
      },
    });
  }

  async findAllByCompany(companyId: string, userId?: string) {
    const whereClause = userId ? { companyId, userId } : { companyId };

    return this.prisma.product.findMany({
      where: whereClause,
      include: { 
        company: true,
        user: true
      },
    });
  }

  async findSamples(userId?: string) {
    const whereClause = userId ? { userId, hasSample: true } : { hasSample: true };

    return this.prisma.product.findMany({
      where: whereClause,
      include: { 
        company: true,
        user: true
      },
    });
  }

  async findOne(id: string, userId?: string) {
    const whereClause: any = { id };
    
    if (userId) {
      whereClause.userId = userId;
    }

    const product = await this.prisma.product.findFirst({
      where: whereClause,
      include: {
        company: true,
        user: true
      },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado ou você não tem permissão para acessá-lo`);
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto, userId?: string) {
    // Verificar se o produto existe e se o usuário tem permissão
    await this.findOne(id, userId);

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        company: true,
        user: true
      }
    });
  }

  async remove(id: string, userId?: string) {
    // Verificar se o produto existe e se o usuário tem permissão
    await this.findOne(id, userId);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
