/*
  Warnings:

  - You are about to drop the column `description` on the `Choice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Choice" DROP COLUMN "description",
ADD COLUMN     "infoMarkdown" TEXT;
