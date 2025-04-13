import { hash, genSalt } from 'bcrypt';
import { Role, type PrismaClient } from '@prisma/client';

export async function initUsers(prisma: PrismaClient) {
  await regularUsers.reduce(async (promise, user) => {
    await promise;
    await prisma.user.create({
      data: { ...user, password: await hashPassword(user.password) },
    });
  }, Promise.resolve());

  await prisma.user.create({
    data: { ...adminUser, password: await hashPassword(adminUser.password) },
  });
}

async function hashPassword(password: string): Promise<string> {
  const SALT = await genSalt();
  return await hash(password, SALT);
}

export async function getRegularUsers(prisma: PrismaClient) {
  return prisma.user.findMany({
    where: { name: { in: regularUsers.map((user) => user.name) } },
    include: { regularUser: true },
  });
}

export async function getAdmin(prisma: PrismaClient) {
  return prisma.user.findFirst({
    where: { name: adminUser.name },
  });
}

const regularUsers = [
  {
    email: 'test1@test.com',
    password: 'test1',
    name: 'User1',
    regularUser: {
      create: {
        phoneNum: '+38050123456',
        passportId: '1234567890',
      },
    },
  },
  {
    email: 'test2@test.com',
    password: 'test2',
    name: 'User2',
    regularUser: {
      create: {
        phoneNum: '+38050234567',
        passportId: '2345678901',
      },
    },
  },
];

const adminUser = {
  email: 'admin@test.com',
  password: 'admin',
  name: 'Admin',
  role: Role.ADMIN,
};
