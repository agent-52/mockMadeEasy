-- CreateEnum
CREATE TYPE "InterviewPhase" AS ENUM ('base', 'followup', 'completed');

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "phase" "InterviewPhase" NOT NULL DEFAULT 'base';
