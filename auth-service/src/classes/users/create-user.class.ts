import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { UpdateUser } from 'src/classes/users/update-user.class';

export class CreateUser extends UpdateUser {
  @ApiProperty({ example: 'test@test.com', description: 'Email' })
  @IsString()
  @IsEmail()
  public email: string;
}
