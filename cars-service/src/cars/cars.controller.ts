import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FUEL_TYPE } from '@prisma/client';
import { Public, RequiredRole } from 'src/auth/auth.guard';
import { CarsService } from 'src/cars/cars.service';
import { CarFilters } from 'src/classes/cars/car-filters.class';
import { CarResponse } from 'src/classes/cars/car-response.class';
import { CreateCar } from 'src/classes/cars/create-car.class';
import { UpdateCar } from 'src/classes/cars/update-car.class';
import { MessageResponse } from 'src/classes/message-response.class';
import { PageResponse } from 'src/classes/pagination/page-response.class';
import { SortOrder } from 'src/classes/pagination/sortable-request.class';
import { Role } from 'src/utils/enums/role.esum';

@ApiTags('Cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @ApiOperation({ summary: 'Get cars page' })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Page number',
    default: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Page limit',
    default: 10,
    required: false,
  })
  @ApiQuery({
    name: 'sort',
    type: String,
    description: 'Sort field',
    example: 'pricePerDay',
    required: false,
  })
  @ApiQuery({
    name: 'order',
    type: String,
    description: 'Sort order',
    enum: SortOrder,
    required: false,
  })
  @ApiQuery({
    name: 'name',
    type: String,
    description: 'Car name',
    example: 'Cor',
    required: false,
  })
  @ApiQuery({
    name: 'brands',
    type: String,
    example: '1,2',
    description: 'Car brand ids',
    required: false,
  })
  @ApiQuery({
    name: 'fuelType',
    type: String,
    enum: FUEL_TYPE,
    description: 'Fuel type',
    required: false,
  })
  @ApiQuery({
    name: 'isAvailable',
    type: Boolean,
    description: 'Is available',
    required: false,
  })
  @ApiQuery({
    name: 'minPrice',
    type: Number,

    description: 'Min price',
    required: false,
  })
  @ApiQuery({
    name: 'maxPrice',
    type: Number,
    description: 'Max price',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Cars',
    type: PageResponse<CarResponse>,
  })
  @Public()
  @Get()
  public async getCarBrands(@Query() filters: CarFilters) {
    const page = await this.carsService.getCarsPage(filters);

    return new PageResponse(
      page.data.map((car) => new CarResponse(car, car.brand)),
      page.total,
    );
  }

  @ApiOperation({ summary: 'Get car by id' })
  @ApiParam({ name: 'id', type: 'number', description: 'id' })
  @ApiResponse({
    status: 200,
    description: 'Car',
    type: CarResponse,
  })
  @Public()
  @Get('/:id')
  public async getCarBrand(@Param('id') id: number) {
    const car = await this.carsService.findCarById(id);

    if (car) {
      return new CarResponse(car, car.brand);
    } else {
      return { message: 'Car not found' };
    }
  }

  @ApiOperation({ summary: 'Create car' })
  @ApiBody({ type: CreateCar })
  @ApiResponse({
    status: 200,
    description: 'Created car',
    type: CarResponse,
  })
  @ApiBearerAuth()
  @RequiredRole(Role.ADMIN)
  @Post()
  public async createCarBrand(@Body() carData: CreateCar) {
    const car = await this.carsService.createCar(carData);
    return new CarResponse(car, car.brand);
  }

  @ApiOperation({ summary: 'Update car' })
  @ApiParam({ name: 'id', type: 'number', description: 'Car id' })
  @ApiBody({ type: UpdateCar })
  @ApiResponse({
    status: 200,
    description: 'Updated car',
    type: CarResponse,
  })
  @ApiBearerAuth()
  @RequiredRole(Role.ADMIN)
  @Put('/:id')
  public async updateCarBrand(
    @Param('id') id: number,
    @Body() brandData: UpdateCar,
  ) {
    const car = await this.carsService.updateCar(id, brandData);
    return new CarResponse(car, car.brand);
  }

  @ApiOperation({ summary: 'Delete car' })
  @ApiParam({ name: 'id', type: 'number', description: 'Car id' })
  @ApiResponse({
    status: 200,
    description: 'Car deleted',
    type: MessageResponse,
  })
  @ApiBearerAuth()
  @RequiredRole(Role.ADMIN)
  @Delete('/:id')
  public async deleteCarBrand(@Param('id') id: number) {
    return this.carsService.deleteCar(id);
  }
}
