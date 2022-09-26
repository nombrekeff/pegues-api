/*
  Warnings:

  - A unique constraint covering the columns `[authorId,id]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Media_authorId_id_key" ON "Media"("authorId", "id");
