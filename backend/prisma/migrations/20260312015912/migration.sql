/*
  Warnings:

  - You are about to drop the column `voiceId` on the `TtsCache` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "TtsCache_textHash_voiceId_key";

-- AlterTable
ALTER TABLE "TtsCache" DROP COLUMN "voiceId";
