import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type User } from '@prisma/client';
import type { SignInRequest } from 'src/classes/auth/sign-in-request.class';
import { TokenResponse } from 'src/classes/auth/token-response.class';
import type { CreateUser } from 'src/classes/users/create-user.class';
import { JWT_CONSTANTS } from 'src/constants/jwt/jwt.constants';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/utils/auth/password-encoder.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  public async signIn(creadentials: SignInRequest): Promise<TokenResponse> {
    let user: User;
    try {
      user = await this.userService.getUserByEmail(creadentials.email);
    } catch (error) {
      throw new ForbiddenException('Invalid Credentials');
    }

    if (!(await comparePassword(creadentials.password, user.password))) {
      throw new ForbiddenException('Invalid Credentials');
    }

    return this.generateToken(user);
  }

  private async generateToken(user: User): Promise<TokenResponse> {
    return new TokenResponse(
      await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
    );
  }

  public async signUp(userData: CreateUser): Promise<TokenResponse> {
    const user = await this.userService.createUser(userData);
    return this.generateToken(user);
  }

  public getKeys() {
    return {
      publicKey: JWT_CONSTANTS.PUBLIC_KEY,
    };
  }
}
