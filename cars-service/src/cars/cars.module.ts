import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { BrandsModule } from './brands/brands.module';

@Module({
  controllers: [CarsController],
  providers: [CarsService],
  imports: [BrandsModule]
})
export class CarsModule {}
