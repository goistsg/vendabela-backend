import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCompanyDto) {
    return this.prisma.company.create({ 
      data: dto,
      include: {
        users: {
          include: {
            user: true,
            segment: true
          }
        }
      }
    });
  }

  async findAll() {   
    return this.prisma.company.findMany({
      include: { 
        users: {
          include: {
            user: true,
            segment: true
          }
        }
      },
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: { 
        users: {
          include: {
            user: true,
            segment: true
          }
        }
      },
    });

    if (!company) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }

    return company;
  }

  async update(id: string, dto: UpdateCompanyDto) {
    // Verificar se a empresa existe
    await this.findOne(id);

    return this.prisma.company.update({
      where: { id },
      data: dto,
      include: { 
        users: {
          include: {
            user: true,
            segment: true
          }
        }
      },
    });
  }

  async remove(id: string) {
    // Verificar se a empresa existe
    await this.findOne(id);

    return this.prisma.company.delete({
      where: { id },
    });
  }
}
