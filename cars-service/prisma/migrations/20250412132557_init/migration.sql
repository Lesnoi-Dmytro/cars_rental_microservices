-- CreateEnum
CREATE TYPE "FUEL_TYPE" AS ENUM ('GASOLINE', 'PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID');

-- CreateTable
CREATE TABLE "CarBrand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CarBrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarPhoto" (
    "id" SERIAL NOT NULL,
    "carId" INTEGER NOT NULL,
    "photoUrl" TEXT NOT NULL,

    CONSTRAINT "CarPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "brandId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "mileage" INTEGER NOT NULL,
    "fuelType" "FUEL_TYPE" NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "pricePerDay" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seed" (
    "id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Seed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CarPhoto" ADD CONSTRAINT "CarPhoto_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "CarBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
