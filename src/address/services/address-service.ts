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

  async create(dto: CreateAddressDto, userId: string) {
    const includeClause: any = {
      user: true,
      orders: true,
    };

    // Incluir client apenas se clientId estiver presente
    if (dto.clientId) {
      includeClause.client = true;
    }

    // Remover clientId do spread e adicionar apenas se estiver presente
    const { clientId, ...dtoWithoutClientId } = dto;
    
    const data: any = {
      ...dtoWithoutClientId,
      userId: userId,
    };

    // Adicionar clientId apenas se estiver presente e não for string vazia
    if (clientId && clientId.trim() !== '') {
      data.clientId = clientId;
    }

    return this.prisma.address.create({ 
      data,
      include: includeClause,
    });
  }

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      include: {
        user: true,
        client: true, // Pode ter clientId ou não, então sempre inclui
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
        // Não inclui client pois clientId é null por definição nesta query
      }
    });
  }

  async findOne(id: string, userId: string) {
    const whereClause = { id, userId };

    const address = await this.prisma.address.findUnique({ 
      where: whereClause,
      include: {
        user: true,
        client: true, // Pode ter clientId ou não, então sempre inclui
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

    // Buscar o endereço atual para verificar se tem clientId
    const currentAddress = await this.prisma.address.findUnique({
      where: { id },
      select: { clientId: true },
    });

    const includeClause: any = {
      user: true,
      orders: true,
    };

    // Remover clientId do spread e tratar separadamente
    const { clientId, ...dtoWithoutClientId } = dto;
    
    const data: any = {
      ...dtoWithoutClientId,
    };

    // Se clientId foi fornecido e não é vazio, usar o valor
    // Se foi fornecido como string vazia ou undefined, setar como null para remover a relação
    if (clientId !== undefined) {
      if (clientId && clientId.trim() !== '') {
        data.clientId = clientId;
      } else {
        data.clientId = null; // Remove a relação se foi passado vazio
      }
    }
    // Se clientId não foi fornecido no DTO, não inclui no data (mantém o valor atual)

    // Incluir client apenas se o endereço tiver ou receber clientId
    if (currentAddress?.clientId || data.clientId) {
      includeClause.client = true;
    }

    return this.prisma.address.update({
      where: { id },
      data,
      include: includeClause,
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
