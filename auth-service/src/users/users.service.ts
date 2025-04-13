import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { Role, type Prisma } from '@prisma/client';
import type { CreateUser } from 'src/classes/users/create-user.class';
import type { UpdateUser } from 'src/classes/users/update-user.class';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword } from 'src/utils/auth/password-encoder.utils';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('RABBITMQ_SERVICE') private readonly rabbitService: ClientProxy,
  ) {}

  public async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { regularUser: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  public async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { regularUser: true },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  public async createUser(userData: CreateUser) {
    const user = await this.prisma.user.findFirst({
      where: { email: userData.email },
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const { phoneNum, passportId, ...data } = userData;
    const createData: Prisma.UserCreateInput = data;

    createData.password = await hashPassword(data.password);
    createData.role = Role.USER;
    createData.regularUser = { create: { phoneNum, passportId } };

    return await this.prisma.user.create({
      data: createData,
    });
  }

  public async updateUser(id: number, newUser: UpdateUser) {
    const { phoneNum, passportId, ...data } = newUser;
    const updateData: Prisma.UserUpdateInput = data;

    updateData.password = await hashPassword(data.password);
    updateData.regularUser = { update: { phoneNum, passportId } };

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: { regularUser: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    this.rabbitService.emit('user_updated', user);

    return user;
  }

  public deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  public async sameUserOrAdminGuard(userId: number, currentUserId: number) {
    if (userId === currentUserId) return true;

    const user = await this.getUserById(currentUserId);
    return user.role === Role.ADMIN;
  }
}
