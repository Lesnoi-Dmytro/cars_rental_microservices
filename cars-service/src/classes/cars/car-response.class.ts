import { ApiProperty } from '@nestjs/swagger';
import { Car, CarBrand, FUEL_TYPE } from '@prisma/client';
import { CarBrandResponse } from 'src/classes/cars/car-brands/car-brand-response.class';

export class CarResponse implements Omit<Car, 'brandId'> {
  @ApiProperty({ example: 1, description: 'Id' })
  public id: number;

  @ApiProperty({ example: 'Corolla', description: 'Name' })
  public name: string;

  @ApiProperty({ example: 'Reliable sedan', description: 'Description' })
  public description: string;

  @ApiProperty({ example: 2021, description: 'Year' })
  public year: number;

  @ApiProperty({ example: 'Black', description: 'Color' })
  public color: string;

  @ApiProperty({ example: 100000, description: 'Mileage' })
  public mileage: number;

  @ApiProperty({ example: FUEL_TYPE.GASOLINE, description: 'Fuel type' })
  public fuelType: FUEL_TYPE;

  @ApiProperty({ example: true, description: 'Is available' })
  public isAvailable: boolean;

  @ApiProperty({ example: 100, description: 'Price per day' })
  public pricePerDay: number;

  @ApiProperty({ description: 'Car brand' })
  public brand: CarBrandResponse;

  constructor(car: Car, brand: CarBrand) {
    this.id = car.id;
    this.name = car.name;
    this.description = car.description;
    this.year = car.year;
    this.color = car.color;
    this.mileage = car.mileage;
    this.fuelType = car.fuelType;
    this.isAvailable = car.isAvailable;
    this.pricePerDay = car.pricePerDay;
    this.brand = new CarBrandResponse(brand);
  }
}
