import { Module } from '@nestjs/common';
import { DamageReportController } from './damage-report.controller';
import { DamageReportService } from './damage-report.service';
import { PaymentModule } from 'src/payment/payment.module';
import { ReservationModule } from 'src/reservation/reservation.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [DamageReportController],
  providers: [DamageReportService],
  imports: [ReservationModule, PaymentModule, UsersModule],
})
export class DamageReportModule {}
