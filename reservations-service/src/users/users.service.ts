import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AuthUser } from 'src/classes/users/auth-user.class';
import type { UserClass } from 'src/classes/users/user.class';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  private readonly GATEWAY_URL: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly http: HttpService,
    config: ConfigService,
  ) {
    this.GATEWAY_URL = config.get('GATEWAY_URL') ?? 'http://localhost:3000';
  }

  public async createUserIfEmpty(userId: number, token: string) {
    const oldUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!oldUser) {
      const userResponse = await this.http.axiosRef.get<AuthUser>(
        `${this.GATEWAY_URL}/api/users/${userId}`,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      const user = userResponse.data;

      return this.prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNum: user.regularUser?.phoneNum,
          passportId: user.regularUser?.passportId,
        },
      });
    }
  }

  public async findAuthUserById(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  public async updateUser(user: AuthUser) {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        phoneNum: user.regularUser?.phoneNum,
        passportId: user.regularUser?.passportId,
      },
    });
  }
}
