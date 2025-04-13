/*
  Warnings:

  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Char(72)` to `Char(60)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" SET DATA TYPE CHAR(60);
