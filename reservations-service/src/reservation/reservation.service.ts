import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ReservationStatus, type Prisma } from '@prisma/client';
import { CarsService } from 'src/cars/cars.service';
import type { JwtUser } from 'src/classes/auth/jwt_user.class';
import { PageResponse } from 'src/classes/pagination/page-response.class';
import type { CreateReservation } from 'src/classes/reservations/create-reservation.class';
import type { ReservationFilters } from 'src/classes/reservations/reservation-filters.class';
import { PaymentService } from 'src/payment/payment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/utils/enums/role.esum';
import {
  getPaginationFilter,
  getSortingFilter,
} from 'src/utils/pagination/pagination.utils';

@Injectable()
export class ReservationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
    private readonly carsService: CarsService,
    private readonly usersService: UsersService,
  ) {}

  private readonly include = {
    user: true,
    car: true,
    damageReport: {
      include: {
        reporter: true,
        photos: true,
      },
    },
  };

  public async getAllReservations(filters: ReservationFilters, user: JwtUser) {
    if (!filters) {
      filters = {};
    }
    if (user.role !== Role.ADMIN) {
      filters.userId = user.id;
    }

    const where: Prisma.ReservationWhereInput = {};

    where.userId = filters.userId;
    where.carId = filters.carId;
    where.status = filters.status;

    return new PageResponse(
      await this.prisma.reservation.findMany({
        ...getPaginationFilter(filters),
        ...getSortingFilter(filters),
        where,
        include: this.include,
      }),
      await this.prisma.reservation.count({
        where,
      }),
    );
  }

  public async getReservationById(id: number, user: JwtUser) {
    const reservation = await this.prisma.reservation.findUnique({
      where: {
        id,
      },
      include: this.include,
    });

    if (user.role !== 'ADMIN' && user.id !== reservation?.userId) {
      throw new ForbiddenException(
        'You are not allowed to view this reservation',
      );
    }

    return reservation;
  }

  public async getReservationsByUser(id: number) {
    return this.prisma.reservation.findMany({
      where: {
        userId: id,
      },
    });
  }

  public async createReservation(
    reservation: CreateReservation,
    userId: number,
    token: string,
  ) {
    const car = await this.carsService.findOrCreateCar(reservation.car);

    const endDate = new Date(reservation.startDate);
    endDate.setDate(endDate.getDate() + reservation.duration);
    const reserved = await this.prisma.reservation.findFirst({
      where: {
        carId: car.id,
        startDate: { gte: reservation.startDate, lte: endDate },
        status: {
          not: ReservationStatus.CANCELLED,
        },
      },
      select: { id: true },
    });
    if (reserved) {
      throw new BadRequestException('Car is already reserved');
    }

    await this.usersService.createUserIfEmpty(userId, token);

    const { car: reservationCar, ...data } = reservation;
    return this.prisma.reservation.create({
      data: {
        ...data,
        carId: car.id,
        price: car.pricePerDay * reservation.duration,
        status: ReservationStatus.PENDING,
        userId,
        issuedAt: new Date(),
      },
      include: this.include,
    });
  }

  public async cancelReservation(id: number, user: JwtUser) {
    const reservation = await this.prisma.reservation.findUnique({
      where: {
        id,
      },
      select: {
        status: true,
        paymentId: true,
      },
    });
    if (!reservation) {
      throw new BadRequestException('Reservation not found');
    }
    if (
      reservation.status === ReservationStatus.CANCELLED ||
      reservation.status === ReservationStatus.COMPLETED ||
      reservation.status === ReservationStatus.REFUNDING
    ) {
      throw new BadRequestException("Reservation can't cancelled");
    }

    let updated;
    if (reservation.paymentId) {
      await this.paymentService.initiateRefund(reservation.paymentId);
      updated = await this.prisma.reservation.update({
        where: {
          id,
        },
        data: {
          status: ReservationStatus.REFUNDING,
        },
        include: this.include,
      });
    } else {
      updated = await this.prisma.reservation.update({
        where: {
          id,
        },
        data: {
          status: ReservationStatus.CANCELLED,
        },
        include: this.include,
      });
    }

    if (user.role !== Role.ADMIN && updated?.userId !== user.id) {
      throw new ForbiddenException(
        'You are not allowed to cancel this reservation',
      );
    }

    return updated;
  }

  public async confirmReservation(id: number) {
    return this.prisma.reservation.update({
      where: {
        id,
      },
      data: {
        status: ReservationStatus.CONFIRMED,
      },
      include: this.include,
    });
  }

  public async initiatePayment(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: {
        id,
      },
      select: {
        price: true,
      },
    });
    if (!reservation) {
      throw new BadRequestException('Reservation not found');
    }

    const paymentRes = await this.paymentService.initiatePayment(
      reservation.price,
    );
    const payment = paymentRes.data;

    await this.prisma.reservation.update({
      where: {
        id,
      },
      data: {
        paymentId: payment.id,
      },
    });

    return payment;
  }

  public async damagedReservation(id: number) {
    return this.prisma.reservation.update({
      where: {
        id,
      },
      data: {
        status: ReservationStatus.DAMAGED,
      },
    });
  }

  public async payedReservation(id: number) {
    const reservation = await this.prisma.reservation.findFirst({
      where: {
        OR: [
          {
            paymentId: id,
          },
          {
            damageReport: {
              paymentId: id,
            },
          },
        ],
      },
    });

    if (!reservation) {
      return;
    }

    if (reservation.status === ReservationStatus.DAMAGED) {
      return this.prisma.reservation.update({
        where: {
          id: reservation.id,
        },
        data: {
          status: ReservationStatus.COMPLETED,
        },
        include: this.include,
      });
    } else {
      return this.prisma.reservation.update({
        where: {
          id: reservation.id,
        },
        data: {
          status: ReservationStatus.PAYED,
        },
        include: this.include,
      });
    }
  }

  public async completeReservation(id: number) {
    return this.prisma.reservation.update({
      where: {
        id,
      },
      data: {
        status: ReservationStatus.COMPLETED,
      },
      include: this.include,
    });
  }
}
