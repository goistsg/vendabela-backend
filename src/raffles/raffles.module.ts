import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RafflesService } from './services/raffles-service';
import { RafflesController } from './controller/raffles-controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [RafflesController],
  providers: [RafflesService],
})
export class RafflesModule {}
