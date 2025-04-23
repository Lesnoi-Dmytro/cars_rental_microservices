import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { AppController } from 'src/app.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  CacheModule,
  type CacheModuleAsyncOptions,
} from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpCacheInterceptor } from 'src/interceptors/cache.interceptor';

@Global()
@Module({
  imports: [
    AuthModule,
    UsersModule,
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
    CacheModule.registerAsync<CacheModuleAsyncOptions>({
      useFactory: async (configService: ConfigService) => {
        return {
          ttl: 10 * 60 * 1000,
          stores: [
            createKeyv(
              `redis://${configService.get<string>('REDIS_HOST')}:${parseInt(configService.get<string>('REDIS_PORT')!)}`,
            ),
          ],
        };
      },
      isGlobal: true,
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    AppService,
    UsersService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
  exports: [PrismaService, ClientsModule, CacheModule],
})
export class AppModule {}
