import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      process.env.AUTH_SERVICE_URL,
      process.env.CARS_SERVICE_URL,
      process.env.RESERVATIONS_SERVICE_URL,
      process.env.PAYMENT_SERVICE_URL,
    ],
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
