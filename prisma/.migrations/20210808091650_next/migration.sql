/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Zone` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Zone.name_unique" ON "Zone"("name");
