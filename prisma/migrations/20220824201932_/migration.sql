-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_routeId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "routeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE SET NULL ON UPDATE CASCADE;
