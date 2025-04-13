import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
  @ApiProperty({ example: 'Message', description: 'Message' })
  public message: string;

  constructor(message: string) {
    this.message = message;
  }
}
