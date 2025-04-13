import { PaymentService } from './payment.service';
import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentRequest } from 'src/classes/payment/initiate-payment-request.class';
import { InitiatePaymentResponse } from 'src/classes/payment/initiate-payment-response.class';
import { PaymentDetailsResponse } from 'src/classes/payment/payment-details-response.class';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Complete payment' })
  @ApiParam({ name: 'id', description: 'Payment Id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Payment completed',
    type: PaymentDetailsResponse,
  })
  @Post('/:id')
  public completePayment(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.completePayment(id);
  }

  @ApiOperation({ summary: 'Initiate payment' })
  @ApiBody({
    description: 'Payment amount',
    type: PaymentRequest,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment initiated',
    type: InitiatePaymentResponse,
  })
  @Post()
  public initiatePayment(@Body() data: PaymentRequest) {
    return this.paymentService.initiatePayment(data.amount);
  }

  @ApiOperation({ summary: 'Refund payment' })
  @ApiParam({ name: 'id', description: 'Payment Id', example: 1 })
  @Post('/refund/:id')
  public refundPayment(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.initiateRefund(id);
  }
}
