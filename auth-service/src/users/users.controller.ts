import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { RegularUser, User } from '@prisma/client';
import { CurrentUser } from 'src/auth/auth.guard';
import { MessageResponse } from 'src/classes/message-response.class';
import { UpdateUser } from 'src/classes/users/update-user.class';
import { UserResponse } from 'src/classes/users/user-response.interface';
import { UsersService } from 'src/users/users.service';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiResponse({
    status: 200,
    description: 'User response',
    type: UserResponse,
  })
  @Get('/:id')
  public async getUser(@Param('id') id: number) {
    return this.formatUserResponse(await this.usersService.getUserById(id));
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiResponse({
    status: 200,
    description: 'Updated user',
    type: UserResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized user change',
    type: ForbiddenException,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiBody({ type: UpdateUser })
  @Put('/:id')
  public async updateUser(
    @Param('id') id: number,
    @Body() newUser: UpdateUser,
    @CurrentUser('id') currentUserId: number,
  ) {
    if (!(await this.usersService.sameUserOrAdminGuard(id, currentUserId))) {
      return new ForbiddenException(
        'You are not authorized to change this user',
      );
    }

    return this.formatUserResponse(
      await this.usersService.updateUser(id, newUser),
    );
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiResponse({
    status: 200,
    description: 'User deleted',
    type: MessageResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized user change',
    type: ForbiddenException,
  })
  @Delete('/:id')
  public async deleteUser(
    @Param('id') id: number,
    @CurrentUser('id') currentUserId: number,
  ) {
    if (!(await this.usersService.sameUserOrAdminGuard(id, currentUserId))) {
      return new ForbiddenException(
        'You are not authorized to change this user',
      );
    }

    const user = await this.usersService.deleteUser(id);

    if (user) {
      return new MessageResponse('User deleted');
    } else {
      return new MessageResponse('User not found');
    }
  }

  private formatUserResponse(user: User & { regularUser: RegularUser | null }) {
    if (user.regularUser) {
      return new UserResponse(user, user.regularUser);
    } else {
      return new UserResponse(user);
    }
  }
}
