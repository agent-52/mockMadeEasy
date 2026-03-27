-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "public"."Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "public"."Subjects" AS ENUM ('react', 'node', 'dsa', 'database');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Questions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dificulty" "public"."Difficulty" NOT NULL,
    "company_id" INTEGER,
    "topic_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Topics" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subject_id" INTEGER NOT NULL,

    CONSTRAINT "Topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subject" (
    "id" SERIAL NOT NULL,
    "title" "public"."Subjects" NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Interviews" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "title" TEXT,

    CONSTRAINT "Interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserResponse" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "interview_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "response" TEXT NOT NULL,
    "attempted_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StatsCard" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "interview_id" INTEGER NOT NULL,
    "total_attempted" INTEGER NOT NULL DEFAULT 0,
    "total_correct" INTEGER NOT NULL DEFAULT 0,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StatsCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StatsCardDetail" (
    "id" SERIAL NOT NULL,
    "statsCard_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "is_correct" BOOLEAN NOT NULL,

    CONSTRAINT "StatsCardDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserResponse_user_id_interview_id_question_id_key" ON "public"."UserResponse"("user_id", "interview_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "StatsCard_user_id_interview_id_key" ON "public"."StatsCard"("user_id", "interview_id");

-- AddForeignKey
ALTER TABLE "public"."Questions" ADD CONSTRAINT "Questions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Questions" ADD CONSTRAINT "Questions_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."Topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Topics" ADD CONSTRAINT "Topics_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interviews" ADD CONSTRAINT "Interviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserResponse" ADD CONSTRAINT "UserResponse_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserResponse" ADD CONSTRAINT "UserResponse_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "public"."Interviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserResponse" ADD CONSTRAINT "UserResponse_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."Questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StatsCard" ADD CONSTRAINT "StatsCard_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StatsCard" ADD CONSTRAINT "StatsCard_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "public"."Interviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StatsCardDetail" ADD CONSTRAINT "StatsCardDetail_statsCard_id_fkey" FOREIGN KEY ("statsCard_id") REFERENCES "public"."StatsCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StatsCardDetail" ADD CONSTRAINT "StatsCardDetail_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."Questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
