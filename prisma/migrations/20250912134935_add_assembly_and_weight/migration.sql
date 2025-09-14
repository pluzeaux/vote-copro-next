/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Choice` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `assemblyId` to the `Resolution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Choice" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Resolution" ADD COLUMN     "assemblyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "createdAt",
DROP COLUMN "weight";

-- CreateTable
CREATE TABLE "Assembly" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assembly_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Resolution" ADD CONSTRAINT "Resolution_assemblyId_fkey" FOREIGN KEY ("assemblyId") REFERENCES "Assembly"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
