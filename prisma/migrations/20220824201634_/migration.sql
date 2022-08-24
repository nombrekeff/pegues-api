/*
  Warnings:

  - A unique constraint covering the columns `[authorId,id]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Session_authorId_projectId_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Session_authorId_id_key" ON "Session"("authorId", "id");
