import { ApiProperty } from '@nestjs/swagger';
import { FUEL_TYPE, type Car } from '@prisma/client';
import { IsString, IsInt, IsEnum, IsBoolean, IsNumber } from 'class-validator';

export class BaseCar implements Omit<Car, 'id' | 'brandId'> {
  @ApiProperty({
    description: 'Car name',
    example: 'Corolla',
  })
  @IsString()
  public name: string;

  @ApiProperty({
    description: 'Car description',
    example: 'Car description',
  })
  @IsString()
  public description: string;

  @ApiProperty({
    description: 'Car year',
    example: 2020,
  })
  @IsInt()
  public year: number;

  @ApiProperty({
    description: 'Car color',
    example: 'Red',
  })
  @IsString()
  public color: string;

  @ApiProperty({
    description: 'Car mileage',
    example: 10000,
  })
  @IsInt()
  public mileage: number;

  @ApiProperty({
    description: 'Car fuel type',
    example: FUEL_TYPE.GASOLINE,
    enum: FUEL_TYPE,
  })
  @IsEnum(FUEL_TYPE)
  public fuelType: FUEL_TYPE;

  @ApiProperty({
    description: 'Car is available',
    example: true,
  })
  @IsBoolean()
  public isAvailable: boolean;

  @ApiProperty({
    description: 'Car price per day',
    example: 100,
  })
  @IsNumber()
  public pricePerDay: number;
}
