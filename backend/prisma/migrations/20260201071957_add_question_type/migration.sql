-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('theory', 'coding');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "type" "QuestionType";
