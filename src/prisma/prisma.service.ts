import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Configuração SSL opcional - só aplica se SSL_CA_PATH estiver definido
    let sslConfig = undefined;
    
    if (process.env.SSL_CA_PATH && fs.existsSync(process.env.SSL_CA_PATH)) {
      try {
        sslConfig = {
          rejectUnauthorized: true,
          ca: fs.readFileSync(process.env.SSL_CA_PATH).toString()
        };
        console.log('🔒 SSL configurado com certificado:', process.env.SSL_CA_PATH);
      } catch (error) {
        console.warn('⚠️ Erro ao carregar certificado SSL:', error.message);
      }
    } else {
      console.log('🔓 Conexão sem SSL (usando Cloud SQL Proxy)');
    }

    super({
      log: ['error', 'warn'],
      errorFormat: 'pretty',
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      console.log('🔌 Database disconnected');
    } catch (error) {
      console.error('Error disconnecting from database:', error);
    }
  }
}
