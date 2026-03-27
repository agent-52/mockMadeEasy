import { Prisma } from "@prisma/client";
import { prisma } from "./db";

async function createStatCard(tx:Prisma.TransactionClient,interviewId:number,userId:number,totalAttempted:number, totalCorrect:number) {
    const statCard =  await tx.statsCard.create({
        data:{
            interviewId,
            userId,
            totalAttempted,
            totalCorrect,
            lastUpdated:new Date()
        }
    })
    return statCard
}

async function alreadyHaveStatCard(tx:Prisma.TransactionClient, interviewId:number) {
    const result = await tx.statsCard.findFirst({
        where:{interviewId}
    })
    if(result){
        return true
    }else{
        return false
    }
}

async function getInterviewStatCard(interviewId:number) {
    const interview = await prisma.interview.findUnique({
        where:{
            id:interviewId
        },select:{
            id:true,
            endedAt:true,
            statsCards:{
                select:{
                    id:true,
                    totalAttempted:true,
                    totalCorrect:true,
                    details:{
                        select:{
                            id:true,
                            questionId:true,
                            isCorrect:true,
                            codeExecutionResult:{
                                select:{
                                    passed:true
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    return interview
}

async function  updateTotalCorrect(tx:Prisma.TransactionClient, statsCardId:number) {
    const count = await tx.statsCardDetail.count({
        where:{
            statsCardId,
            isCorrect: true
        }
    })
    const response = await tx.statsCard.update({
        where:{
            id: statsCardId
        },
        data:{
            totalCorrect:count
        }
    })
    return response.totalCorrect
}

async function updateAccuracy(tx:Prisma.TransactionClient, statsCardId:number, accuracy:number) {
    await tx.statsCard.update({
        where:{
            id:statsCardId
        },
        data:{
            accuracy: accuracy
        }
    })
}

async function updateTotalAttempted(
  tx: Prisma.TransactionClient,
  interviewId: number,
  statsCardId: number
) {
  const attemptedCount = await tx.interviewQuestion.count({
    where: {
      interviewId,
      response: { isNot: null }
    }
  })

  const response = await tx.statsCard.update({
    where: { id: statsCardId },
    data: { totalAttempted: attemptedCount }
  })
  return response.totalAttempted
}


export {createStatCard,getInterviewStatCard,alreadyHaveStatCard, updateTotalCorrect, updateTotalAttempted, updateAccuracy}