import { ApiProperty } from '@nestjs/swagger';

export class HealthResponse {
  @ApiProperty({
    example: 'Server is running',
    description: 'Health check status',
  })
  public status: string;
}
