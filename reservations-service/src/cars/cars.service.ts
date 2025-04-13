import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CarClass } from 'src/classes/cars/car.class';
import type { Car } from '@prisma/client';
import type { UpdatedCar } from 'src/classes/cars/updated-car.class';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  public async findOrCreateCar(car: CarClass): Promise<Car> {
    const oldCar = await this.prisma.car.findUnique({
      where: {
        id: car.id,
      },
    });
    if (oldCar) {
      return oldCar;
    }

    return this.prisma.car.create({
      data: car,
    });
  }

  public async updateCar(car: UpdatedCar) {
    return this.prisma.car.update({
      where: {
        id: car.id,
      },
      data: {
        name: car.name,
        description: car.description,
        pricePerDay: car.pricePerDay,
      },
    });
  }
}
