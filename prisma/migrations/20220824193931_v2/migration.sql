/*
  Warnings:

  - You are about to drop the column `ascent` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `ascentAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `routeId` on the `Session` table. All the data in the column will be lost.
  - The `type` column on the `Zone` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Ascent` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[authorId,projectId,id]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ZoneType" AS ENUM ('outdoors', 'indoors', 'ice', 'other');

-- DropForeignKey
ALTER TABLE "Ascent" DROP CONSTRAINT "Ascent_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Ascent" DROP CONSTRAINT "Ascent_routeId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_routeId_fkey";

-- DropForeignKey
ALTER TABLE "Zone" DROP CONSTRAINT "Zone_authorId_fkey";

-- DropIndex
DROP INDEX "Session_authorId_id_key";

-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "ascent",
DROP COLUMN "ascentAt",
DROP COLUMN "routeId",
ADD COLUMN     "ascent_date" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "has_ascent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notes" TEXT[],
ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "start_date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Zone" ADD COLUMN     "description" TEXT,
ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "authorId" DROP NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "ZoneType" NOT NULL DEFAULT E'outdoors';

-- DropTable
DROP TABLE "Ascent";

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "routeId" TEXT NOT NULL,
    "authorId" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_authorId_routeId_id_key" ON "Project"("authorId", "routeId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_authorId_projectId_id_key" ON "Session"("authorId", "projectId", "id");

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
