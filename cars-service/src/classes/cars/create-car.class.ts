import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsObject, IsString } from 'class-validator';
import { BaseCar } from 'src/classes/cars/base-car.class';
import { UpdateCar } from 'src/classes/cars/update-car.class';

class UpdateCarBrandAttribute {
  @ApiProperty({ example: 1, description: 'Car brand id', required: false })
  @IsInt()
  public id?: number;

  @ApiProperty({
    example: 'Toyota',
    description: 'Car brand name',
    required: false,
  })
  @IsString()
  public name: string;
}

export class CreateCar extends BaseCar {
  @ApiProperty({ description: 'Car brand' })
  @IsObject()
  public brand: UpdateCarBrandAttribute;
}
