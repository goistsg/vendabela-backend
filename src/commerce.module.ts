import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CartsModule } from './carts/carts-module';
import { FavoritesModule } from './favorites/favorites.module';
import { PaymentsModule } from './payments/payments.module';
import { OrdersModule } from 'orders/orders.module';
import { ProductsModule } from 'products/products.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CartsModule,
    FavoritesModule,
    PaymentsModule,
    OrdersModule,
    ProductsModule,
  ],
  exports: [
    PrismaModule,
    AuthModule
  ],
})
export class CommerceModule {}
