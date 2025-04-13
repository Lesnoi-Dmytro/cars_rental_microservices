import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InitiatePaymentResponse } from 'src/classes/payment/initiate-payment-response.class';

@Injectable()
export class PaymentService {
  private readonly GATEWAY_URL: string;

  constructor(
    private readonly http: HttpService,
    config: ConfigService,
  ) {
    this.GATEWAY_URL = config.get('GATEWAY_URL') ?? 'http://localhost:3000';
  }

  public async initiatePayment(amount: number) {
    return this.http.axiosRef.post<InitiatePaymentResponse>(
      `${this.GATEWAY_URL}/api/payment`,
      { amount },
    );
  }

  public async initiateRefund(id: number) {
    return this.http.axiosRef.post<void>(
      `${this.GATEWAY_URL}/api/refund/${id}`,
    );
  }
}
