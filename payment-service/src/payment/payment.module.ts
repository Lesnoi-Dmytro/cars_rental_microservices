import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from 'src/payment/payment.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [],
})
export class PaymentModule {}
