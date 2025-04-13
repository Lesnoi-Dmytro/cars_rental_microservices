import { ApiProperty } from '@nestjs/swagger';
import { DamagePhoto, DamageReport, PaymentStatus, User } from '@prisma/client';
import { UserClass } from 'src/classes/users/user.class';

export class DamageReportResponse
  implements Omit<DamageReport, 'reservationId' | 'createdBy' | 'paymentId'>
{
  @ApiProperty({ example: 1, description: 'Id' })
  public id: number;

  @ApiProperty({ description: 'Reporter' })
  public reporter: UserClass;

  @ApiProperty({ example: 'Broken window', description: 'Damage description' })
  public description: string;

  @ApiProperty({ example: 100, description: 'Repair cost' })
  public price: number;

  @ApiProperty({ example: new Date(), description: 'Reported Date' })
  public date: Date;

  @ApiProperty({ example: ['photo1.jpg', 'photo2.jpg'], description: 'Photos' })
  public photos: string[];

  @ApiProperty({
    example: PaymentStatus.SUCCESS,
    description: 'Payment status',
  })
  public paymentStatus: PaymentStatus | null;

  constructor(
    damageReport: DamageReport,
    reporter: User,
    photos: DamagePhoto[],
  ) {
    this.id = damageReport.id;
    this.description = damageReport.description;
    this.price = damageReport.price;
    this.date = damageReport.date;

    this.reporter = new UserClass(reporter);
    this.photos = photos.map((photo) => photo.photoUrl);
    this.paymentStatus = damageReport.paymentStatus;
  }
}
