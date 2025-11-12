import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './controller/auth-controller';
import { AuthService } from './services/auth.service';
import { TwilioSmsService } from './services/twilio-sms.service';
import { AuthGuard } from './guards/auth.guard';
import { OptionalAuthGuard } from './guards/optional-auth.guard';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TwilioSmsService, AuthGuard, OptionalAuthGuard],
  exports: [AuthService, TwilioSmsService, AuthGuard, OptionalAuthGuard],
})
export class AuthModule {}
