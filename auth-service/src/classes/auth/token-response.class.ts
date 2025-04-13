import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty({ example: 'jwt.access.token', description: 'Access token' })
  public accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
