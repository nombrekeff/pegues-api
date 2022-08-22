-- DropForeignKey
ALTER TABLE "Ascent" DROP CONSTRAINT "Ascent_routeId_fkey";

-- DropForeignKey
ALTER TABLE "Zone" DROP CONSTRAINT "Zone_authorId_fkey";

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ascent" ADD CONSTRAINT "Ascent_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Ascent.authorId_id_unique" RENAME TO "Ascent_authorId_id_key";

-- RenameIndex
ALTER INDEX "Route.authorId_id_unique" RENAME TO "Route_authorId_id_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";

-- RenameIndex
ALTER INDEX "UserPreferences.authorId_id_unique" RENAME TO "UserPreferences_authorId_id_key";

-- RenameIndex
ALTER INDEX "Zone.authorId_id_unique" RENAME TO "Zone_authorId_id_key";
