import type { PrismaClient } from '@prisma/client';

export async function initCarBrands(prisma: PrismaClient) {
  await prisma.carBrand.createMany({
    data: carBrands,
  });
}

export async function getCarBrands(prisma: PrismaClient) {
  return prisma.carBrand.findMany({
    where: { name: { in: carBrands.map((carBrand) => carBrand.name) } },
  });
}

const carBrands = [{ name: 'Toyota' }, { name: 'Ford' }, { name: 'BMW' }];
