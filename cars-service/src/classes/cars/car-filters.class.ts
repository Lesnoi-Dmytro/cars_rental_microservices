import { ApiProperty } from '@nestjs/swagger';
import { FUEL_TYPE } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SortableRequest } from 'src/classes/pagination/sortable-request.class';
import { stringToArray } from 'src/utils/arrays/arrays.utils';

export class CarFilters extends SortableRequest {
  @ApiProperty({ example: 'Corolla', description: 'Car name' })
  @IsString()
  @IsOptional()
  public name?: string;

  @ApiProperty({ example: '1,2', description: 'Car brand ids' })
  @Transform((value) => stringToArray(value.value).map(Number))
  @IsNumber(undefined, { each: true })
  @IsOptional()
  public brands?: number[];

  @ApiProperty({ example: FUEL_TYPE.GASOLINE, description: 'Fuel type' })
  @IsEnum(FUEL_TYPE)
  @IsOptional()
  public fuelType?: FUEL_TYPE;

  @ApiProperty({ example: true, description: 'Is available' })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  public isAvailable?: boolean;

  @ApiProperty({ example: 1, description: 'Min mileage' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0.1)
  public minPrice?: number;

  @ApiProperty({ example: 100, description: 'Max mileage' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0.1)
  public maxPrice?: number;
}
