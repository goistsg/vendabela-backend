import { Injectable, NotFoundException, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../../shared/services/email.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { CreateUserConsumerDto } from 'users/dto/create-user-consumer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(dto: CreateUserDto, currentUser?: any) {
    // Verificar se email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email já cadastrado');
    }

    // Verificar se whatsapp já existe (se fornecido)
    if (dto.whatsapp) {
      const existingWhatsapp = await this.prisma.user.findUnique({
        where: { whatsapp: dto.whatsapp },
      });

      if (existingWhatsapp) {
        throw new BadRequestException('WhatsApp já cadastrado');
      }
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Determinar plano: se admin criar, pode especificar; se auto-registro, usar básico
    let planId: string;
    
    if (currentUser?.plan?.name === 'ADMIN') {
      // Admin pode criar usuário sem especificar plano (usa básico como padrão)
      const basicPlan = await this.prisma.plan.findFirst({
        where: { name: 'Básico' },
      });
      
      if (!basicPlan) {
        throw new NotFoundException('Plano básico não encontrado');
      }
      
      planId = basicPlan.id;
    } else {
      // Auto-registro sempre usa plano básico
      const basicPlan = await this.prisma.plan.findFirst({
        where: { name: 'Básico' },
      });
      
      if (!basicPlan) {
        throw new NotFoundException('Plano básico não encontrado');
      }
      
      planId = basicPlan.id;
    }

    // Criar usuário
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        whatsapp: dto.whatsapp,
        emailVerified: false,
        authProvider: 'EMAIL',
        isActive: true,
        plan: {
          connect: { id: planId },
        },
      },
      include: {
        plan: true,
        companies: {
          include: {
            company: true,
            segment: true,
          },
        },
      },
    });

    // Enviar email de boas-vindas
    try {
      const emailSent = await this.emailService.sendWelcomeEmail(user.email, user.name);
      
      if (emailSent) {
        this.logger.log(`Welcome email sent successfully to ${user.email}`);
      } else {
        this.logger.warn(`Failed to send welcome email to ${user.email} (email service may not be configured)`);
      }
    } catch (error) {
      this.logger.error(`Error sending welcome email to ${user.email}:`, error);
      // Não falhar o registro se o email falhar
    }

    // Remover senha do retorno
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      message: 'Usuário criado com sucesso',
    };
  }

  async createConsumer(dto: CreateUserConsumerDto, companyId: string) {
    const plan = await this.prisma.plan.findFirst({ 
      where: { name: 'CONSUMER' },
    });
    if (!plan) {
      throw new NotFoundException('Plano não encontrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        whatsapp: dto.whatsapp,
        email: dto.email,
        password: hashedPassword,
        emailVerified: false,
        authProvider: 'EMAIL',
        isActive: true,
        plan: {
          connect: { id: plan.id },
        },
      },
      include: {
        plan: true, 
        companies: {
          include: {
            company: true,
            segment: true
          }
        }
      }
    });

    const segment = await this.prisma.segment.findFirst({ 
      where: { name: 'Saas' },
    });

    await this.prisma.userCompany.create({
      data: {
        userId: user.id,
        companyId: companyId,
        segmentId: segment?.id || '',
        role: 'CONSUMER'
      }
    });

    return user;
  }

  async findAll() {   
    return this.prisma.user.findMany({
      include: { 
        plan: true, 
        companies: {
          include: {
            company: true,
            segment: true
          }
        }
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { 
        plan: true, 
        companies: {
          include: {
            company: true,
            segment: true
          }
        }
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    // Verificar se o usuário existe
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: dto,
      include: { 
        plan: true, 
        companies: {
          include: {
            company: true,
            segment: true
          }
        }
      },
    });
  }

  async remove(id: string) {
    // Verificar se o usuário existe
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    // Buscar usuário
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    if (!user.password) {
      throw new BadRequestException('Usuário sem senha cadastrada');
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    // Hash da nova senha
    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);

    // Atualizar senha
    await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedNewPassword,
        passwordChangedAt: new Date(),
      },
    });

    return {
      message: 'Senha alterada com sucesso',
    };
  }
}
