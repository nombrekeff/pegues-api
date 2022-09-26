/*
  Warnings:

  - The `authorId` column on the `Media` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_authorId_fkey";

-- DropIndex
DROP INDEX "Media_authorId_id_key";

-- DropIndex
DROP INDEX "Media_authorId_key";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "authorId",
ADD COLUMN     "authorId" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Media_id_key" ON "Media"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
