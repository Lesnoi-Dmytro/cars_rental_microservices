import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CarFilters } from 'src/classes/cars/car-filters.class';
import {
  getPaginationFilter,
  getSortingFilter,
} from 'src/utils/pagination/pagination.utils';
import type { Prisma } from '@prisma/client';
import { PageResponse } from 'src/classes/pagination/page-response.class';
import { MessageResponse } from 'src/classes/message-response.class';
import type { CreateCar } from 'src/classes/cars/create-car.class';
import type { UpdateCar } from 'src/classes/cars/update-car.class';
import type { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CarsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('RABBITMQ_SERVICE') private readonly rabbitmqService: ClientProxy,
  ) {}

  public async getCarsPage(filters: CarFilters = {}) {
    if (!filters) {
      filters = {};
    }

    const where: Prisma.CarWhereInput = {};

    if (filters.name) {
      where.name = {
        contains: filters.name,
      };
    }
    if (filters.brands) {
      where.brandId = {
        in: filters.brands,
      };
    }

    where.fuelType = filters.fuelType;
    where.isAvailable = filters.isAvailable;

    if (filters.minPrice) {
      where.pricePerDay = {
        gte: filters.minPrice,
      };
    }
    if (filters.maxPrice) {
      if (typeof where.pricePerDay === 'object') {
        where.pricePerDay.lte = filters.maxPrice;
      } else {
        where.pricePerDay = {
          lte: filters.maxPrice,
        };
      }
    }

    return new PageResponse(
      await this.prisma.car.findMany({
        ...getPaginationFilter(filters),
        ...getSortingFilter(filters),
        where,
        include: {
          brand: true,
        },
      }),
      await this.prisma.car.count({
        where,
      }),
    );
  }

  public async findCarById(id: number) {
    return this.prisma.car.findFirst({
      where: {
        id,
      },
      include: {
        brand: true,
      },
    });
  }

  public async createCar(car: CreateCar) {
    return this.prisma.car.create({
      data: {
        ...car,
        brand: car.brand.id
          ? { connect: { id: car.brand.id } }
          : { create: car.brand },
      },
      include: {
        brand: true,
      },
    });
  }

  public async updateCar(id: number, car: UpdateCar) {
    const updated = await this.prisma.car.update({
      where: {
        id,
      },
      data: {
        ...car,
      },
      include: {
        brand: true,
      },
    });

    this.rabbitmqService.emit('car_updated', updated);

    return updated;
  }

  public async deleteCar(id: number) {
    const car = await this.prisma.car.delete({ where: { id } });

    if (car) {
      return new MessageResponse('Car successfully deleted');
    } else {
      return new MessageResponse('Car not found');
    }
  }
}
