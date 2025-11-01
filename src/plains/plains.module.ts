import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PlainsService } from './services/plains-service';
import { PlainsController } from './controller/plains-controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PlainsController],
  providers: [PlainsService],
})
export class PlainsModule {}
