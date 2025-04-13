import { ApiProperty } from '@nestjs/swagger';
import type { CarBrand } from '@prisma/client';

export class CarBrandResponse implements CarBrand {
  @ApiProperty({ example: 1, description: 'id' })
  public id: number;

  @ApiProperty({ example: 'BMW', description: 'Name' })
  public name: string;

  constructor(carBrand: CarBrand) {
    this.id = carBrand.id;
    this.name = carBrand.name;
  }
}
