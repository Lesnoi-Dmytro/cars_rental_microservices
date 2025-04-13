import { ApiProperty } from '@nestjs/swagger';
import type { CarBrand } from '@prisma/client';
import { IsString } from 'class-validator';

export class UpdateCarBrand implements Omit<CarBrand, 'id'> {
  @ApiProperty({ example: 'BMW', description: 'Name' })
  @IsString()
  public name: string;
}
