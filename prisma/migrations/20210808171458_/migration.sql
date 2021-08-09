/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "ascentAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "sessions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tries" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Post";
