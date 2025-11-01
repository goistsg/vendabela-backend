import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserCompaniesController } from './controller/user-companies-controller';
import { UserCompaniesService } from './services/user-companies-service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserCompaniesController],
  providers: [UserCompaniesService],
  exports: [UserCompaniesService],
})
export class UserCompaniesModule {}
