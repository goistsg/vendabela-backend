import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedModule } from '../shared/shared.module';
import { AddressService } from './services/address-service';
import { AddressController } from './controller/address-controller';
import { AuthModule } from '../auth/auth.module';
import { RemoveAddressService } from './services/remove-address-service';

@Module({
  imports: [PrismaModule, AuthModule, SharedModule],
  controllers: [AddressController],
  providers: [AddressService, RemoveAddressService],
  exports: [AddressService],
})
export class AddressModule {}
