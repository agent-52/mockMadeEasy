import { prisma } from "../db";
import { Prisma } from '@prisma/client';

export async function getAllTestCases(tx:Prisma.TransactionClient, questionId:number) {
    const testCases = await tx.testCase.findMany({
        where:{
            questionId: questionId,
        }
        
    })
    return testCases
}

export async function getPublicTestCases(questionId:number) {
    const publicTestCases = await prisma.testCase.findMany({
        where:{
            questionId
        }
    })

    return getPublicTestCases
}