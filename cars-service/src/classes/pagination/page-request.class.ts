import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PageRequest {
  @ApiProperty({
    example: 1,
    description: 'Page number',
    default: 1,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  public page?: number;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    default: 10,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  public limit?: number;
}
