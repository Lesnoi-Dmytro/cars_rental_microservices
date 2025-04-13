import { ApiProperty } from '@nestjs/swagger';
import {
  Car,
  PaymentStatus,
  ReservationStatus,
  type DamagePhoto,
  type DamageReport,
  type Reservation,
  type User,
} from '@prisma/client';
import { CarClass } from 'src/classes/cars/car.class';
import { DamageReportResponse } from 'src/classes/reservations/damage-reports/damage-report-response.class';
import { UserClass } from 'src/classes/users/user.class';

export class ReservationResponse
  implements Omit<Reservation, 'userId' | 'carId' | 'paymentId'>
{
  @ApiProperty({ example: 1, description: 'Id' })
  public id: number;

  @ApiProperty({ description: 'User' })
  public user: UserClass;

  @ApiProperty({ description: 'Car' })
  public car: CarClass;

  @ApiProperty({ example: new Date(), description: 'Reservation date' })
  public startDate: Date;

  @ApiProperty({ example: 4, description: 'Reservation duration in days' })
  public duration: number;

  @ApiProperty({ example: 300, description: 'Total price for reservation' })
  public price: number;

  @ApiProperty({
    example: ReservationStatus.CONFIRMED,
    description: 'Reservation status',
  })
  public status: ReservationStatus;

  @ApiProperty({
    example: PaymentStatus.SUCCESS,
    description: 'Payment status',
  })
  public paymentStatus: PaymentStatus | null;

  @ApiProperty({
    example: new Date(),
    description: 'Reservation creation date',
  })
  public issuedAt: Date;

  @ApiProperty({ description: '' })
  public damageReport?: DamageReportResponse;

  constructor(
    reservation: Reservation,
    car: Car,
    user: User,
    damageReport?: DamageReport,
    damagePhotos?: DamagePhoto[],
    damageReporter?: User,
  ) {
    this.id = reservation.id;
    this.startDate = reservation.startDate;
    this.duration = reservation.duration;
    this.price = reservation.price;
    this.status = reservation.status;
    this.paymentStatus = reservation.paymentStatus;
    this.issuedAt = reservation.issuedAt;

    this.user = new UserClass(user);
    this.car = new CarClass(car);

    if (damageReport && damagePhotos && damageReporter) {
      this.damageReport = new DamageReportResponse(
        damageReport,
        damageReporter,
        damagePhotos,
      );
    }
  }
}
