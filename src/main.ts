import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  console.log('🚀 Starting Vendabela Backend...');
  
  const startTime = Date.now();
  
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos não definidos no DTO
      forbidNonWhitelisted: true, // erro se vier algo fora do DTO
      transform: true, // transforma payload em classe
    }),
  );

  app.setGlobalPrefix('app');

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Vendabela Backend API')
    .setDescription('API completa para gestão de vendas, produtos, clientes e pedidos')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('app/api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Configurar timeout e shutdown hooks
  app.enableShutdownHooks();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  const startupTime = Date.now() - startTime;
  console.log(`✅ Application started successfully in ${startupTime}ms`);
  console.log(`🌐 Server running on: http://localhost:${port}/app`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/app/api`);
  // console.log(`📊 Database connection: Lazy (will connect on first request)`);
}
bootstrap();
