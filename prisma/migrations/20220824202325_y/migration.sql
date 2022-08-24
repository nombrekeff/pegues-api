/*
  Warnings:

  - A unique constraint covering the columns `[routeId,id]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Project_authorId_routeId_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Project_routeId_id_key" ON "Project"("routeId", "id");
