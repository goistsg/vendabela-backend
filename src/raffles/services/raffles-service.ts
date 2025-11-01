import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateRaffleDto } from "../dto/create-raffle.dto";
import { UpdateRaffleDto } from "../dto/update-raffle.dto";
import { CreateRaffleEntryDto } from "../dto/raffle-entry.dto";

@Injectable()
export class RafflesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createRaffleDto: CreateRaffleDto) {
    // Verificar se o usuário tem acesso à empresa
    const userCompany = await this.prisma.userCompany.findFirst({
      where: {
        userId,
        companyId: createRaffleDto.companyId,
      },
    });

    if (!userCompany) {
      throw new ForbiddenException('Usuário não tem acesso a esta empresa');
    }

    // Validar datas
    const startDate = new Date(createRaffleDto.startDate).setHours(14, 0, 0, 0);
    const endDate = new Date(createRaffleDto.endDate).setHours(14, 0, 0, 0);
    const drawDate = new Date(createRaffleDto.drawDate).setHours(14, 0, 0, 0);

    if (startDate >= endDate) {
      console.log(`${startDate} >= ${endDate}`);
      throw new BadRequestException('Data de início deve ser anterior ou igual à data de fim');
    }

    if (endDate >= drawDate) {
      console.log(`${startDate} >= ${endDate}`);
      throw new BadRequestException('Data de fim deve ser anterior ou igual à data do sorteio');
    }

    return this.prisma.raffle.create({
      data: {
        ...createRaffleDto,
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        drawDate: new Date(drawDate),
        createdAt: new Date()
      },
      include: {
        company: true,
        entries: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(userId: string, companyId?: string) {
    const where: any = {};

    if (companyId) {
      // Verificar se o usuário tem acesso à empresa
      const userCompany = await this.prisma.userCompany.findFirst({
        where: {
          userId,
          companyId,
        },
      });

      if (!userCompany) {
        throw new ForbiddenException('Usuário não tem acesso a esta empresa');
      }

      where.companyId = companyId;
    } else {
      // Buscar sorteios de todas as empresas do usuário
      const userCompanies = await this.prisma.userCompany.findMany({
        where: { userId },
        select: { companyId: true },
      });

      where.companyId = {
        in: userCompanies.map(uc => uc.companyId),
      };
    }

    return this.prisma.raffle.findMany({
      where,
      include: {
        company: true,
        entries: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const raffle = await this.prisma.raffle.findUnique({
      where: { id },
      include: {
        company: true,
        entries: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!raffle) {
      throw new NotFoundException('Sorteio não encontrado');
    }

    // Verificar se o usuário tem acesso ao sorteio
    const userCompany = await this.prisma.userCompany.findFirst({
      where: {
        userId,
        companyId: raffle.companyId,
      },
    });

    if (!userCompany) {
      throw new ForbiddenException('Usuário não tem acesso a este sorteio');
    }

    return raffle;
  }

  async update(id: string, userId: string, updateRaffleDto: UpdateRaffleDto) {
    const raffle = await this.findOne(id, userId);

    // Não permitir editar sorteio já sorteado
    if (raffle.isDrawn) {
      throw new BadRequestException('Não é possível editar um sorteio já sorteado');
    }

    const updateData: any = { ...updateRaffleDto };

    // Validar datas se fornecidas
    if (updateRaffleDto.startDate || updateRaffleDto.endDate || updateRaffleDto.drawDate) {
      const startDate = updateRaffleDto.startDate ? new Date(updateRaffleDto.startDate).setHours(14, 0, 0, 0) : raffle.startDate;
      const endDate = updateRaffleDto.endDate ? new Date(updateRaffleDto.endDate).setHours(14, 0, 0, 0) : raffle.endDate;
      const drawDate = updateRaffleDto.drawDate ? new Date(updateRaffleDto.drawDate).setHours(14, 0, 0, 0) : raffle.drawDate;

      if (startDate >= endDate) {
        throw new BadRequestException('Data de início deve ser anterior ou igual à data de fim');
      }

      if (endDate >= drawDate) {
        throw new BadRequestException('Data de fim deve ser anterior ou igual à data do sorteio');
      }

      updateData.startDate = startDate;
      updateData.endDate = endDate;
      updateData.drawDate = drawDate;
    }

    return this.prisma.raffle.update({
      where: { id },
      data: updateData,
      include: {
        company: true,
        entries: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const raffle = await this.findOne(id, userId);

    // Não permitir deletar sorteio já sorteado
    if (raffle.isDrawn) {
      throw new BadRequestException('Não é possível deletar um sorteio já sorteado');
    }

    return this.prisma.raffle.delete({
      where: { id },
    });
  }

  async addEntry(raffleId: string, userId: string, createRaffleEntryDto: CreateRaffleEntryDto) {
    const raffle = await this.findOne(raffleId, userId);

    // Verificar se o sorteio está ativo
    if (!raffle.isActive) {
      throw new BadRequestException('Sorteio não está ativo');
    }

    // Verificar se está dentro do período de inscrições
    const now = new Date();
    if (now < raffle.startDate || now > raffle.endDate) {
      throw new BadRequestException('Fora do período de inscrições');
    }

    // Verificar se já foi sorteado
    if (raffle.isDrawn) {
      throw new BadRequestException('Sorteio já foi realizado');
    }

    // Verificar se o cliente existe e pertence à empresa
    const client = await this.prisma.client.findFirst({
      where: {
        id: createRaffleEntryDto.clientId,
        companyId: raffle.companyId,
      },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado ou não pertence à empresa');
    }

    // Verificar se já existe uma inscrição
    const existingEntry = await this.prisma.raffleEntry.findFirst({
      where: {
        clientId: createRaffleEntryDto.clientId,
        raffleId,
      },
    });

    if (existingEntry) {
      throw new BadRequestException('Cliente já está inscrito neste sorteio');
    }

    // Verificar limite de participantes
    if (raffle.maxEntries) {
      const entriesCount = await this.prisma.raffleEntry.count({
        where: { raffleId },
      });

      if (entriesCount >= raffle.maxEntries) {
        throw new BadRequestException('Limite de participantes atingido');
      }
    }

    // Gerar código único para o participante
    const code = await this.generateUniqueCode();

    return this.prisma.raffleEntry.create({
      data: {
        clientId: createRaffleEntryDto.clientId,
        raffleId,
        code,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });
  }

  async removeEntry(raffleId: string, entryId: string, userId: string) {
    const raffle = await this.findOne(raffleId, userId);

    // Verificar se o sorteio ainda permite remoção de inscrições
    const now = new Date();
    if (now > raffle.endDate) {
      throw new BadRequestException('Período de inscrições já encerrado');
    }

    const entry = await this.prisma.raffleEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      throw new NotFoundException('Inscrição não encontrada');
    }

    if (entry.raffleId !== raffleId) {
      throw new BadRequestException('Inscrição não pertence a este sorteio');
    }

    return this.prisma.raffleEntry.delete({
      where: { id: entryId },
    });
  }

  async drawRaffle(id: string, userId: string) {
    const raffle = await this.findOne(id, userId);

    // Verificar se já foi sorteado
    if (raffle.isDrawn) {
      throw new BadRequestException('Sorteio já foi realizado');
    }

    // Verificar se está na data do sorteio
    const now = new Date();
    if (now < raffle.drawDate) {
      throw new BadRequestException('Ainda não é a data do sorteio');
    }

    // Buscar todos os participantes
    const entries = await this.prisma.raffleEntry.findMany({
      where: { raffleId: id },
    });

    if (entries.length === 0) {
      throw new BadRequestException('Não há participantes para o sorteio');
    }

    // Realizar o sorteio
    const randomIndex = Math.floor(Math.random() * entries.length);
    const winnerEntry = entries[randomIndex];

    // Atualizar o sorteio e marcar o vencedor
    await this.prisma.raffle.update({
      where: { id },
      data: { isDrawn: true },
    });

    await this.prisma.raffleEntry.update({
      where: { id: winnerEntry.id },
      data: { isWinner: true },
    });

    // Retornar o resultado
    return this.prisma.raffle.findUnique({
      where: { id },
      include: {
        company: true,
        entries: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async getEntries(raffleId: string, userId: string) {
    await this.findOne(raffleId, userId);

    return this.prisma.raffleEntry.findMany({
      where: { raffleId },
      select: {
        id: true,
        code: true,
        entryDate: true,
        isWinner: true,
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: {
        entryDate: 'desc',
      },
    });
  }

  /**
   * Gera um código único para o participante do sorteio
   * Formato: 6 caracteres alfanuméricos (ex: "A5D9F2")
   */
  private async generateUniqueCode(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code: string;
    let isUnique = false;

    do {
      // Gerar código de 6 caracteres
      code = '';
      for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      // Verificar se o código já existe
      const existingEntry = await this.prisma.raffleEntry.findUnique({
        where: { code },
      });

      isUnique = !existingEntry;
    } while (!isUnique);

    return code;
  }
}