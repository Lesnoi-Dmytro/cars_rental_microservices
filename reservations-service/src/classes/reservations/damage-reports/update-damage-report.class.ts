import { ApiProperty } from '@nestjs/swagger';
import type { DamageReport } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class UpdateDamageReport
  implements
    Omit<
      DamageReport,
      | 'id'
      | 'reservationId'
      | 'createdBy'
      | 'date'
      | 'paymentStatus'
      | 'paymentId'
    >
{
  @ApiProperty({ example: 'Broken window', description: 'Damage description' })
  @IsString()
  public description: string;

  @ApiProperty({ example: 100, description: 'Damage price' })
  @Type(() => Number)
  @IsNumber()
  public price: number;
}
