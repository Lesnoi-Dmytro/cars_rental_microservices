import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from 'src/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONSTANTS } from 'src/constants/jwt/jwt.constants';
import { AuthGuard } from 'src/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      privateKey: JWT_CONSTANTS.PRIVATE_KEY,
      signOptions: { algorithm: 'RS256', expiresIn: '7d' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
