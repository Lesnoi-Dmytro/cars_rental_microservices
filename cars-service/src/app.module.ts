import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { AppController } from 'src/app.controller';
import { CarsModule } from './cars/cars.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    AuthModule,
    CarsModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ||
                'amqp://user:password@localhost:5672',
            ],
            queue: 'cars_rental_queue',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [PrismaService, AppService],
  exports: [PrismaService, HttpModule, ClientsModule],
})
export class AppModule {}
