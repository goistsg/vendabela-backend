import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { CommerceModule } from './commerce.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  console.log('🚀 Starting Vendabela Backend Commerce Service...');
  
  const startTime = Date.now();
  
  const app_commerce = await NestFactory.create(CommerceModule, {
    logger: ['error', 'warn', 'log'],
  });

  app_commerce.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos não definidos no DTO
      forbidNonWhitelisted: true, // erro se vier algo fora do DTO
      transform: true, // transforma payload em classe
    }),
  );

  app_commerce.setGlobalPrefix('app');

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Vendabela Commerce API')
    .setDescription('API para o serviço de comércio da plataforma Vendabela')
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

  const document = SwaggerModule.createDocument(app_commerce, config);
  SwaggerModule.setup('app/api', app_commerce, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Configurar timeout e shutdown hooks
  app_commerce.enableShutdownHooks();

  const port = process.env.PORT_COMMERCE ?? 3001;
  await app_commerce.listen(port);
  
  const startupTime = Date.now() - startTime;
  console.log(`✅ Application started successfully in ${startupTime}ms`);
  console.log(`🌐 Server running on: http://localhost:${port}/app`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/app/api`);
  // console.log(`📊 Database connection: Lazy (will connect on first request)`);
}
bootstrap();
