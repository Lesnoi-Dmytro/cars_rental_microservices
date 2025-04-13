-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" CHAR(72) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegularUser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "phoneNum" CHAR(13) NOT NULL,
    "passportId" TEXT NOT NULL,

    CONSTRAINT "RegularUser_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "RegularUser_userId_key" ON "RegularUser"("userId");

-- AddForeignKey
ALTER TABLE "RegularUser" ADD CONSTRAINT "RegularUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
