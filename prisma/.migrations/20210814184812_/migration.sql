/*
  Warnings:

  - You are about to drop the column `preferedDiscipline` on the `UserPreferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserPreferences" DROP COLUMN "preferedDiscipline",
ADD COLUMN     "preferredDiscipline" "RouteDiscipline" NOT NULL DEFAULT E'lead';
