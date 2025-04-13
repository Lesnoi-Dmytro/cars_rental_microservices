import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Transport, type MicroserviceOptions } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Car Rental API')
    .setDescription('API for car rental system')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:3003', 'API')
    .addServer('http://localhost:3000', 'Gateway')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3003);

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: [
          process.env.RABBITMQ_URL ?? 'amqp://user:password@localhost:5672',
        ],
        queue: 'cars_rental_queue',
      },
    });

  await microservice.listen();
}
bootstrap();
