/*
  Warnings:

  - You are about to drop the column `stack` on the `Interview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "stack",
ADD COLUMN     "subject" "SubjectType"[];
