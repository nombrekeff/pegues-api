/*
  Warnings:

  - A unique constraint covering the columns `[authorId,name]` on the table `Zone` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Zone.authorId_id_unique";

-- CreateIndex
CREATE UNIQUE INDEX "Zone.authorId_name_unique" ON "Zone"("authorId", "name");
