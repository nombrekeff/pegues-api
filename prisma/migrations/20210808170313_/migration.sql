/*
  Warnings:

  - Made the column `grade` on table `Route` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Route" ALTER COLUMN "grade" SET NOT NULL,
ALTER COLUMN "grade" SET DEFAULT E'uknown';
