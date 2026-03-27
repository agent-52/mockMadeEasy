-- CreateEnum
CREATE TYPE "Language" AS ENUM ('node', 'cpp', 'python');

-- AlterTable
ALTER TABLE "UserResponse" ADD COLUMN     "language" "Language";
