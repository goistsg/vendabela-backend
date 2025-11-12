import { Module } from '@nestjs/common';
import { CartsController } from './controller/carts-controller';
import { CartsService } from './services/carts-service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'auth/auth.module';
import { SharedModule } from 'shared/shared.module';

@Module({
  imports: [PrismaModule, AuthModule, SharedModule],
  controllers: [CartsController],
  providers: [CartsService]
})
export class CartsModule {}
