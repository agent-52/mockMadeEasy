/*
  Warnings:

  - You are about to drop the column `interview_id` on the `StatsCard` table. All the data in the column will be lost.
  - You are about to drop the column `last_updated` on the `StatsCard` table. All the data in the column will be lost.
  - You are about to drop the column `total_attempted` on the `StatsCard` table. All the data in the column will be lost.
  - You are about to drop the column `total_correct` on the `StatsCard` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `StatsCard` table. All the data in the column will be lost.
  - You are about to drop the column `is_correct` on the `StatsCardDetail` table. All the data in the column will be lost.
  - You are about to drop the column `question_id` on the `StatsCardDetail` table. All the data in the column will be lost.
  - You are about to drop the column `statsCard_id` on the `StatsCardDetail` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `attempted_at` on the `UserResponse` table. All the data in the column will be lost.
  - You are about to drop the column `interview_id` on the `UserResponse` table. All the data in the column will be lost.
  - You are about to drop the column `is_correct` on the `UserResponse` table. All the data in the column will be lost.
  - You are about to drop the column `question_id` on the `UserResponse` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `UserResponse` table. All the data in the column will be lost.
  - You are about to drop the `Interviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Topics` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[statsCardId,questionId]` on the table `StatsCardDetail` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `interviewId` to the `StatsCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `StatsCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isCorrect` to the `StatsCardDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionId` to the `StatsCardDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statsCardId` to the `StatsCardDetail` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `title` on the `Subject` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `interviewId` to the `UserResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isCorrect` to the `UserResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionId` to the `UserResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserResponse` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."SubjectType" AS ENUM ('react', 'node', 'dsa', 'database');

-- DropForeignKey
ALTER TABLE "public"."Interviews" DROP CONSTRAINT "Interviews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Questions" DROP CONSTRAINT "Questions_company_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Questions" DROP CONSTRAINT "Questions_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."StatsCard" DROP CONSTRAINT "StatsCard_interview_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."StatsCard" DROP CONSTRAINT "StatsCard_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."StatsCardDetail" DROP CONSTRAINT "StatsCardDetail_question_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."StatsCardDetail" DROP CONSTRAINT "StatsCardDetail_statsCard_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Topics" DROP CONSTRAINT "Topics_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserResponse" DROP CONSTRAINT "UserResponse_interview_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserResponse" DROP CONSTRAINT "UserResponse_question_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserResponse" DROP CONSTRAINT "UserResponse_user_id_fkey";

-- DropIndex
DROP INDEX "public"."StatsCard_user_id_interview_id_key";

-- DropIndex
DROP INDEX "public"."UserResponse_user_id_interview_id_question_id_key";

-- AlterTable
ALTER TABLE "public"."StatsCard" DROP COLUMN "interview_id",
DROP COLUMN "last_updated",
DROP COLUMN "total_attempted",
DROP COLUMN "total_correct",
DROP COLUMN "user_id",
ADD COLUMN     "interviewId" INTEGER NOT NULL,
ADD COLUMN     "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "totalAttempted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalCorrect" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."StatsCardDetail" DROP COLUMN "is_correct",
DROP COLUMN "question_id",
DROP COLUMN "statsCard_id",
ADD COLUMN     "isCorrect" BOOLEAN NOT NULL,
ADD COLUMN     "questionId" INTEGER NOT NULL,
ADD COLUMN     "statsCardId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Subject" DROP COLUMN "title",
ADD COLUMN     "title" "public"."SubjectType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."UserResponse" DROP COLUMN "attempted_at",
DROP COLUMN "interview_id",
DROP COLUMN "is_correct",
DROP COLUMN "question_id",
DROP COLUMN "user_id",
ADD COLUMN     "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "interviewId" INTEGER NOT NULL,
ADD COLUMN     "isCorrect" BOOLEAN NOT NULL,
ADD COLUMN     "questionId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Interviews";

-- DropTable
DROP TABLE "public"."Questions";

-- DropTable
DROP TABLE "public"."Topics";

-- DropEnum
DROP TYPE "public"."Subjects";

-- CreateTable
CREATE TABLE "public"."Question" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" "public"."Difficulty" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuestionCompany" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "QuestionCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Topic" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuestionTopic" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,

    CONSTRAINT "QuestionTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Interview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "title" TEXT,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InterviewQuestion" (
    "id" SERIAL NOT NULL,
    "interviewId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "isCorrect" BOOLEAN,
    "order" INTEGER,
    "timeTaken" INTEGER,

    CONSTRAINT "InterviewQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionCompany_questionId_companyId_key" ON "public"."QuestionCompany"("questionId", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionTopic_questionId_topicId_key" ON "public"."QuestionTopic"("questionId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewQuestion_interviewId_questionId_key" ON "public"."InterviewQuestion"("interviewId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "StatsCardDetail_statsCardId_questionId_key" ON "public"."StatsCardDetail"("statsCardId", "questionId");

-- AddForeignKey
ALTER TABLE "public"."QuestionCompany" ADD CONSTRAINT "QuestionCompany_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuestionCompany" ADD CONSTRAINT "QuestionCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Topic" ADD CONSTRAINT "Topic_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuestionTopic" ADD CONSTRAINT "QuestionTopic_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuestionTopic" ADD CONSTRAINT "QuestionTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interview" ADD CONSTRAINT "Interview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InterviewQuestion" ADD CONSTRAINT "InterviewQuestion_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "public"."Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InterviewQuestion" ADD CONSTRAINT "InterviewQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserResponse" ADD CONSTRAINT "UserResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserResponse" ADD CONSTRAINT "UserResponse_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "public"."Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserResponse" ADD CONSTRAINT "UserResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StatsCard" ADD CONSTRAINT "StatsCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StatsCard" ADD CONSTRAINT "StatsCard_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "public"."Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StatsCardDetail" ADD CONSTRAINT "StatsCardDetail_statsCardId_fkey" FOREIGN KEY ("statsCardId") REFERENCES "public"."StatsCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StatsCardDetail" ADD CONSTRAINT "StatsCardDetail_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
