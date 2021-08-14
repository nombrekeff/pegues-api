/*
  Warnings:

  - A unique constraint covering the columns `[authorId]` on the table `Zone` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId]` on the table `Route` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId]` on the table `Ascent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Zone.authorId_unique" ON "Zone"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Route.authorId_unique" ON "Route"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Ascent.authorId_unique" ON "Ascent"("authorId");

-- AlterIndex
ALTER INDEX "UserPreferences_authorId_unique" RENAME TO "UserPreferences.authorId_unique";
