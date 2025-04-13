import { ApiProperty } from '@nestjs/swagger';

export class PageResponse<T> {
  @ApiProperty({
    example: [],
    description: 'Data',
  })
  public data: T[];

  @ApiProperty({
    example: 0,
    description: 'Total items',
  })
  public total: number;

  constructor(data: T[], total: number) {
    this.data = data;
    this.total = total;
  }
}
