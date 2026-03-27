/*
  Warnings:

  - Made the column `voiceId` on table `TtsCache` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TtsCache" ALTER COLUMN "voiceId" SET NOT NULL,
ALTER COLUMN "voiceId" SET DEFAULT 'JBFqnCBsd6RMkjVDRZzb';
