import { InterviewPhase, Prisma } from "@prisma/client";
import { prisma } from "./db";

async function findFollowUpsToThisQuestion(tx:Prisma.TransactionClient ,questionId:number) {
    const result = await tx.question.findMany({
        where:{
            followUpToQuesitonId:questionId
        }
    })
    return result
}

async function followUpsToThisInterview(
  tx: Prisma.TransactionClient,
  interviewId: number,
  statsCardId: number
) {
  // 1. Get correct base theory questions
  const correctBaseQuestions = await tx.statsCardDetail.findMany({
    where: {
      statsCardId,
      isCorrect: true,
      question: { type: "theory" }
    },
    select: {
      questionId: true
    }
  })

  const baseQuestionIds = correctBaseQuestions.map(q => q.questionId)

  if (baseQuestionIds.length === 0) {
    return []
  }

  // 2. Get follow-up questions for those base questions
  const followUpQuestions = await tx.question.findMany({
    where: {
      followUpToQuesitonId: { in: baseQuestionIds }
    }
  })

  if (followUpQuestions.length === 0) {
    return []
  }

  // 3. Get already injected questions in this interview
  const alreadyAsked = await tx.interviewQuestion.findMany({
    where: {
      interviewId,
      questionId: {
        in: followUpQuestions.map(q => q.id)
      }
    },
    select: { questionId: true }
  })

  const alreadyAskedIds = new Set(alreadyAsked.map(q => q.questionId))

  // 4. Filter out already-injected follow-ups
  const newFollowUps = followUpQuestions.filter(
    q => !alreadyAskedIds.has(q.id)
  )

  return newFollowUps
}


async function canSkipFollowup(interviewId:number, phase:InterviewPhase) {
  if(phase !== "followup"){
      return false
  }
}


export {findFollowUpsToThisQuestion, followUpsToThisInterview}