import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { StoreService } from './services/store-service';
import { StoreController } from './controller/store-controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
