/*
  Warnings:

  - You are about to drop the column `tokenId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `assemblyId` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_tokenId_fkey";

-- DropIndex
DROP INDEX "Token_ownerId_key";

-- AlterTable
ALTER TABLE "Assembly" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "assemblyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "tokenId",
DROP COLUMN "weight",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_assemblyId_fkey" FOREIGN KEY ("assemblyId") REFERENCES "Assembly"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
