import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExternalApiService } from '../../shared/services/external-api-service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    private prisma: PrismaService,
    private externalApiService: ExternalApiService,
  ) {}

  create(dto: CreateAddressDto, userId: string) {
    return this.prisma.address.create({ 
      data: {
        ...dto,
        userId: userId
      },
      include: {
        user: true,
        client: true,
        orders: true
      }
    });
  }

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      include: {
        user: true,
        client: true,
        orders: true
      }
    });
  }

  async findAllByClient(clientId: string, userId: string) {
    return this.prisma.address.findMany({
      where: { clientId, userId },
      include: {
        user: true,
        client: true,
        orders: true
      }
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.address.findMany({
      where: { userId, clientId: null },
      include: {
        user: true,
        client: true
      }
    });
  }

  async findOne(id: string, userId: string) {
    const whereClause = { id, userId };

    const address = this.prisma.address.findUnique({ 
      where: whereClause,
      include: {
        user: true,
        client: true,
        orders: true
      }
    });

    if (!address) {
      throw new NotFoundException(`Endereço com ID ${id} não encontrado ou você não tem permissão para acessá-lo`);
    }

    return address;
  }

  async update(id: string, dto: UpdateAddressDto, userId: string) {

    await this.findOne(id, userId);

    return this.prisma.address.update({
      where: { id },
      data: dto,
      include: {
        user: true,
        client: true,
        orders: true
      }
    });
  }

  /**
   * Busca um endereço existente pelo CEP ou cria um novo usando a API ViaCEP
   * @param zipCode CEP para buscar
   * @param userId ID do usuário
   * @returns Endereço encontrado ou criado
   */
  async findOrCreateByZipCode(zipCode: string, number: string, userId: string) {
    // Primeiro, tenta encontrar um endereço existente
    let address = await this.prisma.address.findFirst({
      where: { zipCode, userId },
    });

    if (!address) {
      // Se não encontrou, busca na API ViaCEP
      const addressData = await this.externalApiService.searchCEP(zipCode);
      
      // Cria o endereço com os dados da API
      address = await this.prisma.address.create({
        data: {
          zipCode: addressData.cep,
          street: addressData.logradouro,
          complement: addressData.complemento || '',
          district: addressData.bairro,
          city: addressData.localidade,
          state: addressData.uf,
          number,
          userId: userId,
        },
      });
    }

    return address;
  }
}
