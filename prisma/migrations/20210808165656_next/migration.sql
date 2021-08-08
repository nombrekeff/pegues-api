/*
  Warnings:

  - Added the required column `grade` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('uknown', 'g3', 'g4', 'g5', 'g6A', 'g6AP', 'g6B', 'g6BP', 'g6C', 'g6CP', 'g7A', 'g7AP', 'g7B', 'g7BP', 'g7C', 'g7CP', 'g8A', 'g8AP', 'g8B', 'g8BP', 'g8C', 'g8CP', 'g9A', 'g9AP');

-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "grade" "Grade" NOT NULL;
