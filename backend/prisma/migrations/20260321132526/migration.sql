/*
  Warnings:

  - You are about to drop the column `concetptDepth` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `confidenceLevle` on the `Interview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "concetptDepth",
DROP COLUMN "confidenceLevle",
ADD COLUMN     "conceptDepth" TEXT,
ADD COLUMN     "confidenceLevel" TEXT;
