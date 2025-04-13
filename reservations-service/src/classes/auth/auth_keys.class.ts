import { ApiProperty } from '@nestjs/swagger';

export class AuthKeys {
  @ApiProperty({ example: 'publicKey', description: 'Public RSA key' })
  public publicKey: string;

  constructor(publicKey: string) {
    this.publicKey = publicKey;
  }
}
