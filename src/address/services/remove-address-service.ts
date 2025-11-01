import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExternalApiService } from '../../shared/services/external-api-service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Injectable()
export class RemoveAddressService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async remove(id: string, userId: string) {
    await this.prisma.address.delete({
      where: { id, userId },
    });
  }
}
