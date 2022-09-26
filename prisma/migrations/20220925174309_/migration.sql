/*
  Warnings:

  - You are about to drop the column `used` on the `Media` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profileImageId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "used",
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "authorId" SET NOT NULL,
ALTER COLUMN "authorId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Media_userId_key" ON "Media"("userId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
