import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInRequest {
  @ApiProperty({
    type: 'string',
    description: 'User email',
    example: 'test@test.com',
  })
  @IsString()
  public email: string;

  @ApiProperty({
    type: 'string',
    description: 'User password',
    example: 'password',
  })
  @IsString()
  public password: string;
}
