import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExternalApiService } from './services/external-api-service';
import { CalculationService } from './services/calculation-service';
import { PaymentGeneratorService } from './services/payment-generator-service';
import { EmailService } from './services/email.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [HttpModule],
  providers: [
    PrismaService,
    ExternalApiService,
    CalculationService,
    PaymentGeneratorService,
    EmailService,
  ],
  exports: [
    ExternalApiService,
    CalculationService,
    PaymentGeneratorService,
    EmailService,
  ],
})
export class SharedModule {}
