import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PageRequest } from 'src/classes/pagination/page-request.class';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class SortableRequest extends PageRequest {
  @ApiProperty({
    example: 'name',
    description: 'Sort by field',
    required: false,
  })
  @IsString()
  @IsOptional()
  public sort?: string;

  @ApiProperty({
    example: SortOrder.ASC,
    description: 'Sort order',
    default: SortOrder.ASC,
    required: false,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  public order?: SortOrder;
}
