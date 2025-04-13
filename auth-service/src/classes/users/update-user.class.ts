import { ApiProperty } from '@nestjs/swagger';
import {
  IsPassportNumber,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUser {
  @ApiProperty({ example: 'John', description: 'Name' })
  @IsString()
  @MaxLength(50)
  public name: string;

  @ApiProperty({ example: '+380501234567', description: 'Phone number' })
  @IsString()
  @IsPhoneNumber('UA')
  public phoneNum: string;

  @ApiProperty({ example: 'XX123456', description: 'Pasport ID' })
  @IsString()
  @IsPassportNumber('UA')
  public passportId: string;

  @ApiProperty({ example: 'password', description: 'Password' })
  @IsString()
  @MaxLength(50)
  public password: string;
}
