import { ApiProperty } from '@nestjs/swagger';
import type { RegularUser, Role, User } from '@prisma/client';
import { RegularUserResponse } from 'src/classes/users/regular-user-response.class';

export class UserResponse implements Omit<User, 'id' | 'password'> {
  @ApiProperty({ example: 'John', description: 'Name' })
  public name: string;

  @ApiProperty({ example: 1, description: 'ID' })
  public id: number;

  @ApiProperty({ example: 'john@gmail.com', description: 'Email' })
  public email: string;

  @ApiProperty({ example: 'ADMIN', description: 'Role' })
  public role: Role;

  @ApiProperty({
    example: { phoneNum: '+380501234567', passportId: 'XX123456' },
    description: 'Regular user details',
  })
  public regularUser?: RegularUserResponse;

  constructor(user: User, regularUser?: RegularUser) {
    this.name = user.name;
    this.id = user.id;
    this.email = user.email;
    this.role = user.role;

    if (regularUser) {
      this.regularUser = new RegularUserResponse(regularUser);
    }
  }
}
