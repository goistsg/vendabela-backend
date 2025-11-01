import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePlanDto } from "../dto/create-plan.dto";
import { UpdatePlanDto } from "../dto/update-plan.dto";

@Injectable()
export class PlainsService {
  constructor(private prisma: PrismaService) {}

  async create(createPlanDto: CreatePlanDto) {
    // Verificar se já existe um plano com o mesmo nome
    const existingPlan = await this.prisma.plan.findUnique({
      where: { name: createPlanDto.name },
    });

    if (existingPlan) {
      throw new BadRequestException('Já existe um plano com este nome');
    }

    return this.prisma.plan.create({
      data: createPlanDto,
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.plan.findMany({
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        price: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException('Plano não encontrado');
    }

    return plan;
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    const plan = await this.findOne(id);

    // Se está alterando o nome, verificar se não existe outro plano com o mesmo nome
    if (updatePlanDto.name && updatePlanDto.name !== plan.name) {
      const existingPlan = await this.prisma.plan.findUnique({
        where: { name: updatePlanDto.name },
      });

      if (existingPlan) {
        throw new BadRequestException('Já existe um plano com este nome');
      }
    }

    return this.prisma.plan.update({
      where: { id },
      data: updatePlanDto,
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const plan = await this.findOne(id);

    // Verificar se há usuários usando este plano
    const usersCount = await this.prisma.user.count({
      where: { planId: id },
    });

    if (usersCount > 0) {
      throw new BadRequestException(
        `Não é possível deletar este plano pois há ${usersCount} usuário(s) utilizando-o`
      );
    }

    return this.prisma.plan.delete({
      where: { id },
    });
  }

  async getPublicPlans() {
    return this.prisma.plan.findMany({
      where: { isInternal: false },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        price: 'asc',
      },
    });
  }

  async getInternalPlans() {
    return this.prisma.plan.findMany({
      where: { isInternal: true },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        price: 'asc',
      },
    });
  }

  async getPlanUsers(id: string) {
    const plan = await this.findOne(id);

    return this.prisma.user.findMany({
      where: { planId: id },
      select: {
        id: true,
        name: true,
        whatsapp: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getPlanStats(id: string) {
    const plan = await this.findOne(id);

    const stats = await this.prisma.user.groupBy({
      by: ['planId'],
      where: { planId: id },
      _count: {
        id: true,
      },
    });

    const totalUsers = stats[0]?._count.id || 0;

    return {
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
      },
      totalUsers,
      revenue: totalUsers * plan.price,
    };
  }
}