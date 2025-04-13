import { ApiProperty } from '@nestjs/swagger';

export class InitiatePaymentResponse {
  @ApiProperty({ example: 1, description: 'Payment id' })
  public id: number;

  @ApiProperty({ example: 100, description: 'Payment amount' })
  public amount: number;
}
