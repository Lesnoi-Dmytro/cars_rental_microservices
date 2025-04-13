import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public, RequiredRole } from 'src/auth/auth.guard';
import { BrandsService } from 'src/cars/brands/brands.service';
import { CarBrandResponse } from 'src/classes/cars/car-brands/car-brand-response.class';
import { CreateCarBrand } from 'src/classes/cars/car-brands/create-car-brand.class';
import { UpdateCarBrand } from 'src/classes/cars/car-brands/update-car-brand.class';
import { MessageResponse } from 'src/classes/message-response.class';
import { Role } from 'src/utils/enums/role.esum';

@ApiTags('Car Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @ApiOperation({ summary: 'Get car brands' })
  @ApiResponse({
    status: 200,
    description: 'Car brands',
    type: [CarBrandResponse],
  })
  @Public()
  @Get()
  public async getCarBrands() {
    return (await this.brandsService.findAllCarBrands()).map(
      (car) => new CarBrandResponse(car),
    );
  }

  @ApiOperation({ summary: 'Get car brand by id' })
  @ApiParam({ name: 'id', type: 'number', description: 'Car brand id' })
  @ApiResponse({
    status: 200,
    description: 'Car brand',
    type: CarBrandResponse,
  })
  @Public()
  @Get('/:id')
  public async getCarBrand(@Param('id') id: number) {
    const car = await this.brandsService.findCarBrandById(id);

    if (car) {
      return new CarBrandResponse(car);
    } else {
      return { message: 'Car brand not found' };
    }
  }

  @ApiOperation({ summary: 'Create car brand' })
  @ApiBody({ type: CreateCarBrand })
  @ApiResponse({
    status: 200,
    description: 'Created car brand',
    type: CarBrandResponse,
  })
  @ApiBearerAuth()
  @RequiredRole(Role.ADMIN)
  @Post()
  public async createCarBrand(@Body() brandData: CreateCarBrand) {
    return new CarBrandResponse(
      await this.brandsService.createCarBrand(brandData),
    );
  }

  @ApiOperation({ summary: 'Update car brand' })
  @ApiParam({ name: 'id', type: 'number', description: 'Car brand id' })
  @ApiBody({ type: UpdateCarBrand })
  @ApiResponse({
    status: 200,
    description: 'Updated car brand',
    type: CarBrandResponse,
  })
  @ApiBearerAuth()
  @RequiredRole(Role.ADMIN)
  @Put('/:id')
  public async updateCarBrand(
    @Param('id') id: number,
    @Body() brandData: UpdateCarBrand,
  ) {
    return new CarBrandResponse(
      await this.brandsService.updateCarBrand(id, brandData),
    );
  }

  @ApiOperation({ summary: 'Delete car brand' })
  @ApiParam({ name: 'id', type: 'number', description: 'Car brand id' })
  @ApiResponse({
    status: 200,
    description: 'Car deleted',
    type: MessageResponse,
  })
  @ApiBearerAuth()
  @RequiredRole(Role.ADMIN)
  @Delete('/:id')
  public async deleteCarBrand(@Param('id') id: number) {
    return this.brandsService.deleteCarBrand(id);
  }
}
