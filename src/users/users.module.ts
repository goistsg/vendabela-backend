import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './controller/user-controller';
import { UsersService } from './services/users-service';
import { AuthModule } from '../auth/auth.module';
import { UserConsumerController } from './controller/user-consumer-controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UsersController, UserConsumerController],
  providers: [UsersService],
})
export class UsersModule {}
