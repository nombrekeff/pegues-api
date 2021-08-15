/*
  Warnings:

  - You are about to drop the column `zoneId` on the `Route` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_authorId_fkey1";

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "zoneId";
