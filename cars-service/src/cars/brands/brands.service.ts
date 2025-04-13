import { BadRequestException, Injectable } from '@nestjs/common';
import type { CreateCarBrand } from 'src/classes/cars/car-brands/create-car-brand.class';
import type { UpdateCarBrand } from 'src/classes/cars/car-brands/update-car-brand.class';
import { MessageResponse } from 'src/classes/message-response.class';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllCarBrands() {
    return this.prisma.carBrand.findMany();
  }

  public async findCarBrandById(id: number) {
    return this.prisma.carBrand.findUnique({
      where: {
        id,
      },
    });
  }

  public async createCarBrand(brandData: CreateCarBrand) {
    return this.prisma.carBrand.create({
      data: brandData,
    });
  }

  public async updateCarBrand(id: number, brandData: UpdateCarBrand) {
    return this.prisma.carBrand.update({
      where: {
        id,
      },
      data: brandData,
    });
  }

  public async deleteCarBrand(id: number) {
    const brand = await this.prisma.carBrand.findFirst({
      where: { id },
      include: { cars: true },
    });
    if (!brand) {
      return new MessageResponse('Car brand not found');
    }
    if (brand.cars.length > 0) {
      throw new BadRequestException('Car brand has cars');
    }

    const deletedBrand = await this.prisma.carBrand.delete({
      where: {
        id,
      },
    });
    if (!deletedBrand) {
      return new MessageResponse('Car brand not found');
    } else {
      return new MessageResponse('Car brand successfully deleted');
    }
  }
}
