/*
  Warnings:

  - You are about to drop the `Route` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_authorId_fkey1";

-- DropTable
DROP TABLE "Route";
