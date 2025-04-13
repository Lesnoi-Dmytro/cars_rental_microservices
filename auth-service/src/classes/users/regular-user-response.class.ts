import { ApiProperty } from '@nestjs/swagger';
import type { RegularUser } from '@prisma/client';

export class RegularUserResponse implements Omit<RegularUser, 'id' | 'userId'> {
  @ApiProperty({ example: '+380501234567', description: 'Phone number' })
  public phoneNum: string;

  @ApiProperty({ example: 'XX123456', description: 'Pasport ID' })
  public passportId: string;

  constructor(regularUser: RegularUser) {
    this.phoneNum = regularUser.phoneNum;
    this.passportId = regularUser.passportId;
  }
}
