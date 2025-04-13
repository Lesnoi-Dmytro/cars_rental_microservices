import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { SortableRequest } from 'src/classes/pagination/sortable-request.class';

export class ReservationFilters extends SortableRequest {
  @ApiProperty({ example: 1, description: 'User id' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  public userId?: number;

  @ApiProperty({ example: 1, description: 'Car id' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  public carId?: number;

  @ApiProperty({
    example: ReservationStatus.DAMAGED,
    description: 'Reservation status',
  })
  @IsEnum(ReservationStatus)
  @IsOptional()
  public status?: ReservationStatus;
}
