/*
  Warnings:

  - A unique constraint covering the columns `[authorId]` on the table `Zone` will be added. If there are existing duplicate values, this will fail.
  - Made the column `authorId` on table `Zone` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Zone" ALTER COLUMN "authorId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Zone.authorId_unique" ON "Zone"("authorId");
