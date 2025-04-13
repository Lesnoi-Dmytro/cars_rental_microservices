import { forwardRef, Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { PaymentModule } from 'src/payment/payment.module';
import { UsersModule } from 'src/users/users.module';
import { CarsModule } from 'src/cars/cars.module';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
  imports: [PaymentModule, UsersModule, CarsModule],
  exports: [ReservationService],
})
export class ReservationModule {}
