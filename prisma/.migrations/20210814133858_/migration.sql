-- CreateEnum
CREATE TYPE "RouteDiscipline" AS ENUM ('lead', 'boulder', 'trad', 'dws', 'other');

-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "discipline" "RouteDiscipline" NOT NULL DEFAULT E'other';
