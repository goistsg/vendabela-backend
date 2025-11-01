import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserCompanyDto } from '../dto/create-user-company.dto';
import { UpdateUserCompanyDto } from '../dto/update-user-company.dto';
import { Prisma, UserCompany } from '@prisma/client';

@Injectable()
export class UserCompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserCompanyDto) {
    // Verificar se o relacionamento já existe
    const existingRelation = await this.prisma.userCompany.findUnique({
      where: {
        userId_companyId: {
          userId: dto.userId,
          companyId: dto.companyId,
        },
      },
    });

    if (existingRelation) {
      throw new ConflictException('Usuário já está vinculado a esta empresa');
    }

    const data = dto as unknown as Prisma.UserCompanyCreateArgs['data']
    return this.prisma.userCompany.create({ 
      data,
      include: {
        user: true,
        company: true,
        segment: true,
      }
    });
  }

  async findAll() {   
    return this.prisma.userCompany.findMany({
      include: { 
        user: true,
        company: true,
        segment: true,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.userCompany.findMany({
      where: { userId },
      include: { 
        user: true,
        company: true,
        segment: true,
      },
    });
  }

  async findByCompany(companyId: string) {
    return this.prisma.userCompany.findMany({
      where: { companyId },
      include: { 
        user: true,
        company: true,
        segment: true,
      },
    });
  }

  async findByUserAndCompany(userId: string, companyId: string) {
    return this.prisma.userCompany.findUnique({
      where: { userId_companyId: { userId, companyId } },
      include: { 
        user: true,
        company: true,
        segment: true,
      },
    });
  }

  async findOne(id: string) {
    const userCompany = await this.prisma.userCompany.findUnique({
      where: { id },
      include: { 
        user: true,
        company: true,
        segment: true,
      },
    });

    if (!userCompany) {
      throw new NotFoundException(`Relacionamento usuário-empresa com ID ${id} não encontrado`);
    }

    return userCompany;
  }

  async update(id: string, dto: UpdateUserCompanyDto) {
    // Verificar se o relacionamento existe
    await this.findOne(id);

    const data = dto as unknown as Prisma.UserCompanyCreateArgs['data']
    return this.prisma.userCompany.update({
      where: { id },
      data,
      include: { 
        user: true,
        company: true,
        segment: true,
      },
    });
  }

  async remove(id: string) {
    // Verificar se o relacionamento existe
    await this.findOne(id);

    return this.prisma.userCompany.delete({
      where: { id },
    });
  }

  async removeByUserAndCompany(userId: string, companyId: string) {
    const userCompany = await this.prisma.userCompany.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    if (!userCompany) {
      throw new NotFoundException('Relacionamento usuário-empresa não encontrado');
    }

    return this.prisma.userCompany.delete({
      where: { id: userCompany.id },
    });
  }
}
