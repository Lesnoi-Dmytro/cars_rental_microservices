import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { BaseCar } from 'src/classes/cars/base-car.class';

export class UpdateCar extends BaseCar {
  @ApiProperty({
    description: 'Car brand id',
    example: 1,
  })
  @IsInt()
  public brandId: number;
}
