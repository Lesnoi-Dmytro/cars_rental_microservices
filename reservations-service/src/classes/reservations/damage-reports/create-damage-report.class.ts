import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, MinLength } from 'class-validator';
import { UpdateDamageReport } from 'src/classes/reservations/damage-reports/update-damage-report.class';

export class CreateDamageReport extends UpdateDamageReport {
  @ApiProperty({ example: 1, description: 'Vacancy id' })
  @Type(() => Number)
  @IsInt()
  public reservationId: number;

  @ApiProperty({
    example: ['photo1.jpg', 'photo2.jpg'],
    description: 'Damage photos',
  })
  @IsString({ each: true })
  @MinLength(1)
  public photos: string[];
}
