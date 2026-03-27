/*
  Warnings:

  - Made the column `timeTaken` on table `InterviewQuestion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `averageTime` on table `Question` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "InterviewQuestion" ALTER COLUMN "timeTaken" SET NOT NULL,
ALTER COLUMN "timeTaken" SET DEFAULT 0,
ALTER COLUMN "timeInsight" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "averageTime" SET NOT NULL,
ALTER COLUMN "averageTime" SET DEFAULT 7;
