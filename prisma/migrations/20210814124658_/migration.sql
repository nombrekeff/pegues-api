/*
  Warnings:

  - You are about to drop the column `ascentAt` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `sessions` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `tries` on the `Route` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Route" DROP COLUMN "ascentAt",
DROP COLUMN "sessions",
DROP COLUMN "tries";

-- CreateTable
CREATE TABLE "Ascent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "routeId" TEXT NOT NULL,
    "authorId" TEXT,
    "ascentAt" TIMESTAMP(3),
    "sessions" INTEGER NOT NULL DEFAULT 0,
    "tries" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ascent" ADD FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ascent" ADD FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
