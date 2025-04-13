import { ApiProperty } from '@nestjs/swagger';
import { Car } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class CarClass implements Car {
  @ApiProperty({ example: 1, description: 'Id' })
  @Type(() => Number)
  @IsInt()
  public id: number;

  @ApiProperty({ example: 'Corolla', description: 'Name' })
  @IsString()
  public name: string;

  @ApiProperty({ example: 'Reliable sedan', description: 'Description' })
  @IsString()
  public description: string;

  @ApiProperty({ example: 100, description: 'Price per day' })
  @Type(() => Number)
  @IsNumber()
  public pricePerDay: number;

  constructor(car?: Car) {
    if (car) {
      this.id = car.id;
      this.name = car.name;
      this.description = car.description;
      this.pricePerDay = car.pricePerDay;
    }
  }
}
