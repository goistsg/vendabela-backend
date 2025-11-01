import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

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
