import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('RABBITMQ_SERVICE') private readonly rabbitService: ClientProxy,
  ) {}

  public async initiatePayment(amount: number) {
    const taxedAmount = parseFloat((amount * 1.03).toFixed(2));
    const payment = await this.prisma.paymentDetails.create({
      data: {
        amount: taxedAmount,
      },
    });

    return { id: payment.id, amount: taxedAmount };
  }

  public async completePayment(id: number) {
    const status =
      Math.random() > 0.8 ? PaymentStatus.FAILED : PaymentStatus.SUCCESS;

    try {
      const payment = await this.prisma.paymentDetails.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });

      this.rabbitService.emit('payment_completed', id);

      return payment;
    } catch (error) {
      throw new BadRequestException('Payment failed');
    }
  }

  public async initiateRefund(id: number) {
    const payment = await this.prisma.paymentDetails.update({
      where: {
        id,
      },
      data: {
        status: PaymentStatus.REFUNDING,
      },
    });
    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    setTimeout(() => {
      this.prisma.paymentDetails.update({
        where: {
          id,
        },
        data: {
          status: PaymentStatus.REFUNDED,
        },
      });

      this.rabbitService.emit('refund_completed', id);
    }, 2000);
  }
}
