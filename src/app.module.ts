import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { UserCompaniesModule } from './user-companies/user-companies.module';
import { ClientsModule } from './clients/clients.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AddressModule } from './address/address.module';
import { PrismaModule } from './prisma/prisma.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { RafflesModule } from './raffles/raffles.module';
import { PlainsModule } from './plains/plains.module';
import { CartsModule } from './carts/carts-module';
import { FavoritesModule } from './favorites/favorites.module';
import { PaymentsModule } from './payments/payments.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule, 
    UsersModule,
    CompaniesModule,
    UserCompaniesModule,
    ClientsModule,
    ProductsModule, 
    OrdersModule,
    AddressModule,
    FeedbacksModule,
    RafflesModule,
    PlainsModule,
    CartsModule,
    FavoritesModule,
    PaymentsModule,
    StoreModule,
  ],
  exports: [
    PrismaModule,
    AuthModule
  ],
})
export class AppModule {}
