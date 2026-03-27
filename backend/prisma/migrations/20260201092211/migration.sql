-- CreateTable
CREATE TABLE "CodeExecutionResult" (
    "id" SERIAL NOT NULL,
    "statsCardDetailId" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "output" TEXT,
    "error" TEXT,
    "runtimeMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodeExecutionResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CodeExecutionResult_statsCardDetailId_key" ON "CodeExecutionResult"("statsCardDetailId");

-- AddForeignKey
ALTER TABLE "CodeExecutionResult" ADD CONSTRAINT "CodeExecutionResult_statsCardDetailId_fkey" FOREIGN KEY ("statsCardDetailId") REFERENCES "StatsCardDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
