-- AlterTable
ALTER TABLE "Car" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Car_id_seq";

-- AlterTable
ALTER TABLE "CarPhoto" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "CarPhoto_id_seq";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "User_id_seq";
