/*
  Warnings:

  - You are about to drop the column `output` on the `CodeExecutionResult` table. All the data in the column will be lost.
  - Added the required column `failedCount` to the `CodeExecutionResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passedCount` to the `CodeExecutionResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCount` to the `CodeExecutionResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CodeExecutionResult" DROP COLUMN "output",
ADD COLUMN     "failedCount" INTEGER NOT NULL,
ADD COLUMN     "passedCount" INTEGER NOT NULL,
ADD COLUMN     "totalCount" INTEGER NOT NULL;
