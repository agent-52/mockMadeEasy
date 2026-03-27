/*
  Warnings:

  - You are about to drop the column `improvements` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `improvements` on the `InterviewQuestion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "improvements",
ADD COLUMN     "areasToImprove" TEXT[];

-- AlterTable
ALTER TABLE "InterviewQuestion" DROP COLUMN "improvements",
ADD COLUMN     "areasToImprove" TEXT[];
