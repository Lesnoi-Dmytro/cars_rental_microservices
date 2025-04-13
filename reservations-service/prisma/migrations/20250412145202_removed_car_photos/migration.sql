/*
  Warnings:

  - You are about to drop the `CarPhoto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CarPhoto" DROP CONSTRAINT "CarPhoto_carId_fkey";

-- DropTable
DROP TABLE "CarPhoto";
