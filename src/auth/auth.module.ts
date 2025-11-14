import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './controller/auth-controller';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { OptionalAuthGuard } from './guards/optional-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { SharedModule } from 'shared/shared.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, OptionalAuthGuard, AdminGuard],
  exports: [AuthService, AuthGuard, OptionalAuthGuard, AdminGuard],
})
export class AuthModule {}
