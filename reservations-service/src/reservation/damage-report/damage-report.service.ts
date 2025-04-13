import { BadRequestException, Injectable } from '@nestjs/common';
import type { JwtUser } from 'src/classes/auth/jwt_user.class';
import { MessageResponse } from 'src/classes/message-response.class';
import type { CreateDamageReport } from 'src/classes/reservations/damage-reports/create-damage-report.class';
import type { UpdateDamageReport } from 'src/classes/reservations/damage-reports/update-damage-report.class';
import { PaymentService } from 'src/payment/payment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReservationService } from 'src/reservation/reservation.service';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/utils/enums/role.esum';

@Injectable()
export class DamageReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reservationService: ReservationService,
    private readonly paymentService: PaymentService,
    private readonly usersService: UsersService,
  ) {}

  private readonly include = {
    reporter: true,
    photos: true,
  };

  public async getReportById(id: number, user: JwtUser) {
    const report = await this.prisma.damageReport.findFirstOrThrow({
      where: {
        id: id,
      },
      include: this.include,
    });

    if (user.role !== Role.ADMIN && report.createdBy !== user.id) {
      throw new Error('You are not allowed to view this damage report');
    }

    return report;
  }

  public async initiatePayment(id: number) {
    const report = await this.prisma.damageReport.findFirst({
      where: {
        id,
      },
    });

    if (!report) {
      throw new BadRequestException('Damage report not found');
    }

    const paymentRes = await this.paymentService.initiatePayment(report.price);
    const payment = paymentRes.data;

    await this.prisma.damageReport.update({
      where: {
        id,
      },
      data: {
        paymentId: payment.id,
      },
    });

    return payment;
  }

  public async createReport(
    data: CreateDamageReport,
    userId: number,
    token: string,
  ) {
    await this.usersService.createUserIfEmpty(userId, token);

    const damageReport = await this.prisma.damageReport.create({
      data: {
        ...data,
        photos: {
          create: data.photos.map((photo) => ({
            photoUrl: photo,
          })),
        },
        createdBy: userId,
        date: new Date(),
      },
      include: this.include,
    });

    this.reservationService.damagedReservation(data.reservationId);

    return damageReport;
  }

  public async updateReport(id: number, data: UpdateDamageReport) {
    return this.prisma.damageReport.update({
      where: {
        id,
      },
      data: {
        ...data,
        date: new Date(),
      },
      include: this.include,
    });
  }

  public async deleteReport(id: number) {
    const report = await this.prisma.damageReport.delete({
      where: {
        id,
      },
    });

    if (report) {
      if (report.paymentId) {
        this.paymentService.initiateRefund(report.paymentId);
      }
      this.reservationService.completeReservation(report.reservationId);
      return new MessageResponse('Damage report deleted');
    } else {
      return new MessageResponse('Damage report not found');
    }
  }
}
