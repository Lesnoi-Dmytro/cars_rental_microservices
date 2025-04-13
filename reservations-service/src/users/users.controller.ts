import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/auth.guard';
import type { AuthUser } from 'src/classes/users/auth-user.class';
import { UsersService } from 'src/users/users.service';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @EventPattern('user_updated')
  @Public()
  public async updateUser(@Payload() user: AuthUser) {
    await this.usersService.updateUser(user);
  }
}
