/*
  Warnings:

  - Added the required column `difficulty` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleType` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stack` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "InterviewRole" AS ENUM ('frontend', 'backend', 'fullstack', 'dsa');

-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('theory', 'coding', 'mixed');

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "difficulty" "Difficulty" NOT NULL,
ADD COLUMN     "estimatedDuration" TIMESTAMP(3),
ADD COLUMN     "includeIntro" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mode" "Mode" NOT NULL,
ADD COLUMN     "roleType" "InterviewRole" NOT NULL,
ADD COLUMN     "stack" JSONB NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL;
