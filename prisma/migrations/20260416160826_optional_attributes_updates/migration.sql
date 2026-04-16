/*
  Warnings:

  - Made the column `eventCategoriesId` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_eventCategoriesId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "eventCategoriesId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "refreshToken" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventCategoriesId_fkey" FOREIGN KEY ("eventCategoriesId") REFERENCES "EventCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
