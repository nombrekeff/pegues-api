-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "routeId" TEXT NOT NULL,
    "authorId" TEXT,
    "ascentAt" TIMESTAMP(3),
    "ascent" BOOLEAN NOT NULL DEFAULT false,
    "tries" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_authorId_id_key" ON "Session"("authorId", "id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "UserPreferences_authorId_unique" RENAME TO "UserPreferences_authorId_key";
