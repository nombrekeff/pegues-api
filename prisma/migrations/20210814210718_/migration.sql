/*
  Warnings:

  - A unique constraint covering the columns `[authorId,id]` on the table `Route` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId,id]` on the table `Ascent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId,id]` on the table `UserPreferences` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Route.authorId_id_unique" ON "Route"("authorId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Ascent.authorId_id_unique" ON "Ascent"("authorId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences.authorId_id_unique" ON "UserPreferences"("authorId", "id");
