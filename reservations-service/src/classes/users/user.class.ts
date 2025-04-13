import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class UserClass implements User {
  @ApiProperty({ example: 1, description: 'ID' })
  @Type(() => Number)
  @IsInt()
  public id: number;

  @ApiProperty({ example: 'John', description: 'Name' })
  @IsString()
  public name: string;

  @ApiProperty({ example: 'john@gmail.com', description: 'Email' })
  @IsString()
  public email: string;

  @ApiProperty({ example: '+380501234567', description: 'Phone number' })
  @IsString()
  @Optional()
  public phoneNum: string | null;

  @ApiProperty({ example: 'XX123456', description: 'Pasport ID' })
  @IsString()
  @Optional()
  public passportId: string | null;

  constructor(user: User) {
    this.name = user.name;
    this.id = user.id;
    this.email = user.email;
    this.phoneNum = user.phoneNum;
    this.passportId = user.passportId;
  }
}
