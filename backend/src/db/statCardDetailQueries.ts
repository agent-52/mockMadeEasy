import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { findInterviewQuestions } from "./interviewQuestions";

async function createStatCardDetail(tx:Prisma.TransactionClient, interviewId:number, statsCardId:number) {
    const questions = await tx.interviewQuestion.findMany({
        where:{
            interviewId
        },
        
        select:{
            question: {
                select:{
                    id: true,
                    
                }
            }
        },
        orderBy:{order: 'asc'}
        
    })
    const mapping = questions.map((q) => ({
        
        statsCardId,
        questionId:q.question.id,
        isCorrect:null
    }))
    const response = await tx.statsCardDetail.createMany({
        data: mapping
    })
    return response
}


async function findStatsCardDetailId(tx:Prisma.TransactionClient, statsCardId:number, questionId:number) {
    try {
        const result = await prisma.statsCardDetail.findUnique({
            where:{
                statsCardId_questionId:{
                    statsCardId,
                    questionId
                }
                
            },
            select:{
                id:true
            }
        })
        return result?.id   
    } catch (error) {
        console.log("findStatsCardDetailId query failed with error: ", error)
        throw new Error("findStatsCardDetailId query failed")
    }
}
export {createStatCardDetail, findStatsCardDetailId}