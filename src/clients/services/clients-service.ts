import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClientDto, userId?: string) {
    if (!userId) {
      throw new NotFoundException(`userId é obrigatório para criar clientes`);
    }

    return this.prisma.client.create({ 
      data: {
        ...dto,
        userId: userId
      },
      include: { 
        user: true,
        company: true,
        addresses: true
      }
    });
  }

  async findAll(userId?: string) {   
    const whereClause = userId ? { userId } : {};

    return this.prisma.client.findMany({
      where: whereClause,
      include: { 
        user: true,
        company: true,
        addresses: true,
        orders: true
      },
    });
  }

  async findOne(id: string, userId?: string) {
    const whereClause: any = { id };
    
    if (userId) {
      whereClause.userId = userId;
    }

    const client = await this.prisma.client.findFirst({
      where: whereClause,
      include: {
        user: true,
        company: true,
        addresses: true,
        orders: true
      },
    });

    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado ou você não tem permissão para acessá-lo`);
    }

    return client;
  }

  async update(id: string, dto: UpdateClientDto, userId?: string) {
    // Verificar se o cliente existe e se o usuário tem permissão
    await this.findOne(id, userId);

    return this.prisma.client.update({
      where: { id },
      data: dto,
      include: {
        user: true,
        company: true,
        addresses: true,
        orders: true
      }
    });
  }

  async remove(id: string, userId?: string) {
    // Verificar se o cliente existe e se o usuário tem permissão
    await this.findOne(id, userId);

    return this.prisma.client.delete({
      where: { id },
    });
  }
}
