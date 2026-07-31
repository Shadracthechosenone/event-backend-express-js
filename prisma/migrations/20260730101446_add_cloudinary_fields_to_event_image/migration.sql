/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `EventImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicId` to the `EventImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventImage" ADD COLUMN     "bytes" INTEGER,
ADD COLUMN     "format" TEXT,
ADD COLUMN     "originalName" TEXT,
ADD COLUMN     "publicId" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'image';

-- CreateIndex
CREATE UNIQUE INDEX "EventImage_publicId_key" ON "EventImage"("publicId");
