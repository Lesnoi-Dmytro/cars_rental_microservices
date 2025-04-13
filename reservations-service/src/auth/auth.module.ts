import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
