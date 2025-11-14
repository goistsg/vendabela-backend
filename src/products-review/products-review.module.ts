import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsReviewService } from './services/products-review.service';
import { ProductsReviewController } from './controller/products-review.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ProductsReviewController],
  providers: [ProductsReviewService],
})
export class ProductsReviewModule {}
