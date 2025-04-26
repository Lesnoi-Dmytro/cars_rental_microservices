import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  SetMetadata,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, Public } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { AuthKeys } from 'src/classes/auth/auth_keys.class';
import { SignInRequest } from 'src/classes/auth/sign-in-request.class';
import { TokenResponse } from 'src/classes/auth/token-response.class';
import { CreateUser } from 'src/classes/users/create-user.class';
import { UserResponse } from 'src/classes/users/user-response.interface';
import { UsersService } from 'src/users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Sign in user' })
  @ApiBody({ type: SignInRequest })
  @ApiResponse({
    status: 200,
    description: 'User signed in',
    type: TokenResponse,
  })
  @Public()
  @HttpCode(200)
  @Post('/sign-in')
  public signIn(@Body() creadentials: SignInRequest) {
    return this.authService.signIn(creadentials);
  }

  @ApiOperation({ summary: 'Sign up user' })
  @ApiBody({ type: CreateUser })
  @ApiResponse({
    status: 201,
    description: 'User signed up',
    type: TokenResponse,
  })
  @Public()
  @Post('/sign-up')
  public signUp(@Body() userData: CreateUser) {
    return this.authService.signIn(userData);
  }

  @ApiOperation({ summary: 'Get auth public keys' })
  @ApiResponse({
    status: 200,
    description: 'Auth keys',
    type: AuthKeys,
  })
  @Public()
  @Get('/keys')
  public authKeys() {
    return this.authService.getKeys();
  }

  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Current user',
    type: UserResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'User not found',
    type: BadRequestException,
  })
  @ApiBearerAuth()
  @SetMetadata('cacheBy', 'token')
  @Get('/user')
  public async getUser(@CurrentUser('id') userId: number) {
    const user = await this.userService.getUserById(userId);

    if (user.regularUser) {
      return new UserResponse(user, user.regularUser);
    } else {
      return new UserResponse(user);
    }
  }
}
