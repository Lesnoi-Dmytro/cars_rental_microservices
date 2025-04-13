-- AlterTable
ALTER TABLE "DamageReport" ALTER COLUMN "paymentStatus" DROP NOT NULL,
ALTER COLUMN "paymentStatus" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "paymentStatus" DROP NOT NULL,
ALTER COLUMN "paymentStatus" DROP DEFAULT;
