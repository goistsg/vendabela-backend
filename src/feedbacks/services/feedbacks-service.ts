import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserFeedbackDto } from '../dto/create-user-feedback.dto';
import { CreateTestSessionDto } from '../dto/create-test-session.dto';

@Injectable()
export class FeedbacksService {
  constructor(private prisma: PrismaService) {}

  async startSession(testSession: CreateTestSessionDto) {
    return await this.prisma.testSession.create({
      data: {
        testerName: testSession.testerName,
        whatsapp: testSession.whatsapp,
        context: testSession.context,
      },
    });
  }

  async create(userFeedback: CreateUserFeedbackDto) {
    return await this.prisma.userFeedback.create({
      data: {
        sessionId: userFeedback.sessionId,
        testerName: userFeedback.testerName,
        whatsapp: userFeedback.whatsapp,
        screen: userFeedback.screen,
        worked: userFeedback.worked,
        description: userFeedback.description,
        improvementSuggestion: userFeedback.improvementSuggestion,
        untestedReason: userFeedback.untestedReason,
        userId: userFeedback.userId,
      },
    });
  }
}
