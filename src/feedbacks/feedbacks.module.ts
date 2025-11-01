import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FeedbacksController } from './controller/feedbacks-controller';
import { FeedbacksService } from './services/feedbacks-service';

@Module({
  imports: [PrismaModule],
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
})
export class FeedbacksModule {}
