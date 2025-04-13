import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  MinDate,
  ValidateNested,
} from 'class-validator';
import { CarClass } from 'src/classes/cars/car.class';

export class CreateReservation
  implements
    Omit<
      Reservation,
      | 'id'
      | 'userId'
      | 'carId'
      | 'price'
      | 'issuedAt'
      | 'status'
      | 'paymentStatus'
      | 'paymentId'
    >
{
  @ApiProperty({
    description: 'Car Info',
  })
  @Type(() => CarClass)
  @ValidateNested()
  public car: CarClass;

  @ApiProperty({
    example: new Date(),
    description: 'Start date',
  })
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
  public startDate: Date;

  @ApiProperty({
    example: 4,
    description: 'Duration in days',
  })
  @Type(() => Number)
  @IsInt()
  public duration: number;
}
