-- CreateTable
CREATE TABLE "TtsCache" (
    "id" SERIAL NOT NULL,
    "textHash" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "voiceId" TEXT,
    "audioUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TtsCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TtsCache_textHash_key" ON "TtsCache"("textHash");

-- CreateIndex
CREATE UNIQUE INDEX "TtsCache_textHash_voiceId_key" ON "TtsCache"("textHash", "voiceId");
