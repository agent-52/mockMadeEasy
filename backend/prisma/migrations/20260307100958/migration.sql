/*
  Warnings:

  - Added the required column `categoty` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubjectCategory" AS ENUM ('frontend', 'backend', 'database');

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "categoty" "SubjectCategory" NOT NULL;

-- CreateIndex
CREATE INDEX "Interview_userId_startedAt_idx" ON "Interview"("userId", "startedAt");
