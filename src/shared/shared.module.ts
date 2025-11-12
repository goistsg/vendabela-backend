import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExternalApiService } from './services/external-api-service';
import { CalculationService } from './services/calculation-service';
import { PaymentGeneratorService } from './services/payment-generator-service';

@Module({
  imports: [HttpModule],
  providers: [ExternalApiService, CalculationService, PaymentGeneratorService],
  exports: [ExternalApiService, CalculationService, PaymentGeneratorService],
})
export class SharedModule {}
