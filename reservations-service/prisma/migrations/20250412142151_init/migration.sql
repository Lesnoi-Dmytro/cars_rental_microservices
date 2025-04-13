-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'PAYED', 'REFUNDING', 'DAMAGED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDING', 'REFUNDED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNum" CHAR(13),
    "passportId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
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
    "pricePerDay" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "carId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DamageReport" (
    "id" SERIAL NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "DamageReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DamagePhoto" (
    "id" SERIAL NOT NULL,
    "damageReportId" INTEGER NOT NULL,
    "photoUrl" TEXT NOT NULL,

    CONSTRAINT "DamagePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seed" (
    "id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Seed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DamageReport_reservationId_key" ON "DamageReport"("reservationId");

-- AddForeignKey
ALTER TABLE "CarPhoto" ADD CONSTRAINT "CarPhoto_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DamageReport" ADD CONSTRAINT "DamageReport_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DamageReport" ADD CONSTRAINT "DamageReport_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DamagePhoto" ADD CONSTRAINT "DamagePhoto_damageReportId_fkey" FOREIGN KEY ("damageReportId") REFERENCES "DamageReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
