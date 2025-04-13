import { Module } from '@nestjs/common';
import { PaymentService } from 'src/payment/payment.service';

@Module({
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
