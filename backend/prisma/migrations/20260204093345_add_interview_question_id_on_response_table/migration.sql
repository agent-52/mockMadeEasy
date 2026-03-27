/*
  Warnings:

  - You are about to drop the column `interviewId` on the `UserResponse` table. All the data in the column will be lost.
  - You are about to drop the column `questionId` on the `UserResponse` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserResponse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[interviewQuestionId]` on the table `UserResponse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `interviewQuestionId` to the `UserResponse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserResponse" DROP CONSTRAINT "UserResponse_interviewId_fkey";

-- DropForeignKey
ALTER TABLE "UserResponse" DROP CONSTRAINT "UserResponse_questionId_fkey";

-- DropForeignKey
ALTER TABLE "UserResponse" DROP CONSTRAINT "UserResponse_userId_fkey";

-- AlterTable
ALTER TABLE "UserResponse" DROP COLUMN "interviewId",
DROP COLUMN "questionId",
DROP COLUMN "userId",
ADD COLUMN     "interviewQuestionId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserResponse_interviewQuestionId_key" ON "UserResponse"("interviewQuestionId");

-- AddForeignKey
ALTER TABLE "UserResponse" ADD CONSTRAINT "UserResponse_interviewQuestionId_fkey" FOREIGN KEY ("interviewQuestionId") REFERENCES "InterviewQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
