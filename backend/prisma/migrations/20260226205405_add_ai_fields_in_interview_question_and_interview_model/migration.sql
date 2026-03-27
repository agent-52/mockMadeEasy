/*
  Warnings:

  - Added the required column `timeInsight` to the `InterviewQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "aiSummaryGenerated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "codeStructure" INTEGER,
ADD COLUMN     "communicationClarity" INTEGER,
ADD COLUMN     "concetptDepth" INTEGER,
ADD COLUMN     "confidenceLevle" INTEGER,
ADD COLUMN     "improvements" TEXT[],
ADD COLUMN     "logicalThinking" INTEGER,
ADD COLUMN     "recommendedFocus" TEXT[],
ADD COLUMN     "strengths" TEXT[];

-- AlterTable
ALTER TABLE "InterviewQuestion" ADD COLUMN     "aiFeedback" TEXT,
ADD COLUMN     "clarityScore" INTEGER,
ADD COLUMN     "conceptDepthScore" INTEGER,
ADD COLUMN     "confidenceScore" INTEGER,
ADD COLUMN     "gapAnalysis" TEXT,
ADD COLUMN     "idealAnswer" TEXT,
ADD COLUMN     "improvements" TEXT[],
ADD COLUMN     "logicalThinkingScore" INTEGER,
ADD COLUMN     "overallScore" INTEGER,
ADD COLUMN     "strengths" TEXT[],
ADD COLUMN     "timeInsight" JSONB NOT NULL;
