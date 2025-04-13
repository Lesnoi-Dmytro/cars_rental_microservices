import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PaymentRequest {
  @ApiProperty({ example: 100, description: 'Payment amount' })
  @IsNumber()
  public amount: number;
}
