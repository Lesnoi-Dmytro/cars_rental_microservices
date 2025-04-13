import { ApiProperty } from '@nestjs/swagger';
import { PaymentDetails, PaymentStatus } from '@prisma/client';

export class PaymentDetailsResponse implements PaymentDetails {
  @ApiProperty({ example: 1, description: 'Id' })
  public id: number;

  @ApiProperty({ example: 100, description: 'Amount' })
  public amount: number;

  @ApiProperty({ example: PaymentStatus.PENDING, description: 'status' })
  public status: PaymentStatus;

  @ApiProperty({ example: new Date(), description: 'Issued at' })
  public issuedAt: Date;
}
