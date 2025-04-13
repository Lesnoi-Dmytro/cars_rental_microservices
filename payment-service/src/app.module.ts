import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { AppController } from 'src/app.controller';
import { PaymentModule } from './payment/payment.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    PaymentModule,
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
  exports: [PrismaService, ClientsModule],
})
export class AppModule {}
