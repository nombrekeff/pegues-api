-- DropIndex
DROP INDEX "Ascent.authorId_unique";

-- DropIndex
DROP INDEX "Route.authorId_unique";

-- AlterIndex
ALTER INDEX "UserPreferences.authorId_unique" RENAME TO "UserPreferences_authorId_unique";
