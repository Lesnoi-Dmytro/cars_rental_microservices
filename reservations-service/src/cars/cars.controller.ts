import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/auth.guard';
import { CarsService } from 'src/cars/cars.service';
import type { UpdatedCar } from 'src/classes/cars/updated-car.class';

@ApiTags('Cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @EventPattern('car_updated')
  @Public()
  public async updateCarBrand(@Payload() car: UpdatedCar) {
    await this.carsService.updateCar(car);
  }
}
