import { FUEL_TYPE, type Car, type PrismaClient } from '@prisma/client';
import { getCarBrands } from '../../prisma/seeds/1__init_car_brands';
import { uid } from 'uid';

export async function initCars(prisma: PrismaClient) {
  const carBrands = await getCarBrands(prisma);
  if (carBrands.length === 0) {
    throw new Error('No car brands found');
  }

  await cars.reduce(async (promise, car) => {
    await promise;

    const { brand, ...data } = car;
    await prisma.car.create({
      data: {
        ...data,
        brandId: (
          carBrands.find((carBrand) => carBrand.name === car.brand) ||
          carBrands[0]
        ).id,
        photos: {
          create: [
            { photoUrl: `https://file.storage/${uid()}` },
            { photoUrl: `https://file.storage/${uid()}` },
          ],
        },
      },
    });
  }, Promise.resolve());
}

export async function getCars(prisma: PrismaClient) {
  return prisma.car.findMany({
    where: { name: { in: cars.map((car) => car.name) } },
  });
}

const cars: (Omit<Car, 'id' | 'brandId' | 'isAvailable'> & {
  brand: string;
})[] = [
  {
    name: 'Corolla',
    description: 'Reliable sedan',
    brand: 'Toyota',
    year: 2021,
    color: 'White',
    mileage: 25000,
    fuelType: FUEL_TYPE.GASOLINE,
    pricePerDay: 50.0,
  },
  {
    name: 'Camry',
    description: 'Comfortable midsize sedan',
    brand: 'Toyota',
    year: 2022,
    color: 'Black',
    mileage: 20000,
    fuelType: FUEL_TYPE.HYBRID,
    pricePerDay: 60.0,
  },
  {
    name: 'RAV4',
    description: 'Popular compact SUV',
    brand: 'Toyota',
    year: 2023,
    color: 'Blue',
    mileage: 15000,
    fuelType: FUEL_TYPE.GASOLINE,
    pricePerDay: 70.0,
  },
  {
    name: 'Mustang',
    description: 'Powerful sports car',
    brand: 'Ford',
    year: 2020,
    color: 'Red',
    mileage: 30000,
    fuelType: FUEL_TYPE.GASOLINE,
    pricePerDay: 100.0,
  },
  {
    name: 'F-150',
    description: 'Durable pickup truck',
    brand: 'Ford',
    year: 2021,
    color: 'Silver',
    mileage: 40000,
    fuelType: FUEL_TYPE.DIESEL,
    pricePerDay: 80.0,
  },
  {
    name: 'Explorer',
    description: 'Spacious SUV',
    brand: 'Ford',
    year: 2022,
    color: 'Gray',
    mileage: 18000,
    fuelType: FUEL_TYPE.GASOLINE,
    pricePerDay: 90.0,
  },
  {
    name: '3 Series',
    description: 'Luxury sedan',
    brand: 'BMW',
    year: 2021,
    color: 'Black',
    mileage: 22000,
    fuelType: FUEL_TYPE.GASOLINE,
    pricePerDay: 110.0,
  },
  {
    name: 'X5',
    description: 'Luxury SUV',
    brand: 'BMW',
    year: 2023,
    color: 'White',
    mileage: 12000,
    fuelType: FUEL_TYPE.HYBRID,
    pricePerDay: 130.0,
  },
  {
    name: 'M4',
    description: 'Performance coupe',
    brand: 'BMW',
    year: 2022,
    color: 'Blue',
    mileage: 15000,
    fuelType: FUEL_TYPE.GASOLINE,
    pricePerDay: 150.0,
  },
  {
    name: 'Tacoma',
    description: 'Off-road truck',
    brand: 'Toyota',
    year: 2023,
    color: 'Green',
    mileage: 12000,
    fuelType: FUEL_TYPE.GASOLINE,
    pricePerDay: 75.0,
  },
  {
    name: 'Bronco',
    description: 'Adventure SUV',
    brand: 'Ford',
    year: 2022,
    color: 'Orange',
    mileage: 10000,
    fuelType: FUEL_TYPE.GASOLINE,
    pricePerDay: 95.0,
  },
  {
    name: 'i4',
    description: 'Electric sedan',
    brand: 'BMW',
    year: 2023,
    color: 'Silver',
    mileage: 5000,
    fuelType: FUEL_TYPE.ELECTRIC,
    pricePerDay: 140.0,
  },
  {
    name: 'Land Cruiser',
    description: 'Ultimate off-road SUV',
    brand: 'Toyota',
    year: 2021,
    color: 'Black',
    mileage: 28000,
    fuelType: FUEL_TYPE.DIESEL,
    pricePerDay: 85.0,
  },
  {
    name: 'Edge',
    description: 'Family SUV',
    brand: 'Ford',
    year: 2021,
    color: 'Blue',
    mileage: 32000,
    fuelType: FUEL_TYPE.GASOLINE,
    pricePerDay: 65.0,
  },
  {
    name: 'X3',
    description: 'Compact luxury SUV',
    brand: 'BMW',
    year: 2023,
    color: 'White',
    mileage: 11000,
    fuelType: FUEL_TYPE.HYBRID,
    pricePerDay: 115.0,
  },
  {
    name: 'Prius',
    description: 'Fuel-efficient hybrid',
    brand: 'Toyota',
    year: 2022,
    color: 'Silver',
    mileage: 16000,
    fuelType: FUEL_TYPE.HYBRID,
    pricePerDay: 55.0,
  },
  {
    name: 'Fusion',
    description: 'Midsize sedan',
    brand: 'Ford',
    year: 2021,
    color: 'Gray',
    mileage: 25000,
    fuelType: FUEL_TYPE.GASOLINE,
    pricePerDay: 58.0,
  },
  {
    name: 'Z4',
    description: 'Luxury roadster',
    brand: 'BMW',
    year: 2022,
    color: 'Red',
    mileage: 12000,
    fuelType: FUEL_TYPE.GASOLINE,
    pricePerDay: 135.0,
  },
  {
    name: 'Crown',
    description: 'Premium sedan',
    brand: 'Toyota',
    year: 2023,
    color: 'Brown',
    mileage: 9000,
    fuelType: FUEL_TYPE.HYBRID,
    pricePerDay: 125.0,
  },
];
