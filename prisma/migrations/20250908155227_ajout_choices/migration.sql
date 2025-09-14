/*
  Warnings:

  - You are about to drop the column `choice` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `choiceId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "choice",
ADD COLUMN     "choiceId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Choice" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "resolutionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Choice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_resolutionId_fkey" FOREIGN KEY ("resolutionId") REFERENCES "Resolution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_choiceId_fkey" FOREIGN KEY ("choiceId") REFERENCES "Choice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
