import { Prisma } from "@prisma/client";
import { prisma } from "./db"
import { findInterviewQuestions } from "./interviewQuestions";


async function countTotalQuestions(tx:Prisma.TransactionClient, interviewId:number){
    const count = await tx.interviewQuestion.count({
        where:{interviewId},
    })
    return count;
}

async function countAnsweredQuestions(tx:Prisma.TransactionClient, interviewId:number){
    const count = await tx.interviewQuestion.count({
        where:{
          interviewId,
          OR:[
            {response:{isNot:null}},
            {skipped:true}
          ]
        }
    }) 
    return count
}

async function findNextQuestionOrder(
  tx: Prisma.TransactionClient,
  interviewId: number
) {
  const next = await tx.interviewQuestion.findFirst({
    where: {
      interviewId,
      response: null,
      skipped:false
    },
    orderBy: { order: "asc" },
    select: { order: true }
  })

  return next?.order ?? null
}


export {countAnsweredQuestions, countTotalQuestions, findNextQuestionOrder}