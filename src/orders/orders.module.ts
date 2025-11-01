import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OrdersController } from './controller/orders-controller';
import { OrdersService } from './services/orders-service';
import { AuthModule } from '../auth/auth.module';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [PrismaModule, AuthModule, AddressModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
