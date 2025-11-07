import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserConsumerDto } from 'users/dto/create-user-consumer.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: dto,
      include: {
        plan: true, 
        companies: {
          include: {
            company: true,
            segment: true
          }
        }
      }
    });
  }

  async createConsumer(dto: CreateUserConsumerDto) {
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        whatsapp: dto.whatsapp
      } as unknown as CreateUserDto,
      include: {
        plan: true, 
        companies: {
          include: {
            company: true,
            segment: true
          }
        }
      }
    });

    const segment = await this.prisma.segment.findFirst({ 
      where: { name: 'Saas' },
    });

    await this.prisma.userCompany.create({
      data: {
        userId: user.id,
        companyId: dto.companyId,
        segmentId: segment?.id || '',
        role: 'CONSUMER'
      }
    });

    return user;
  }

  async findAll() {   
    return this.prisma.user.findMany({
      include: { 
        plan: true, 
        companies: {
          include: {
            company: true,
            segment: true
          }
        }
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { 
        plan: true, 
        companies: {
          include: {
            company: true,
            segment: true
          }
        }
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    // Verificar se o usuário existe
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: dto,
      include: { 
        plan: true, 
        companies: {
          include: {
            company: true,
            segment: true
          }
        }
      },
    });
  }

  async remove(id: string) {
    // Verificar se o usuário existe
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
