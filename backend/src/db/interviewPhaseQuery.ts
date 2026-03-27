import { InterviewPhase, Prisma } from '@prisma/client';
import { prisma } from './db';
async function updateInterviewPhaseTo(tx:Prisma.TransactionClient,phase:InterviewPhase, id:number) {
    await tx.interview.update({
        where:{
            id
        },
        data:{
            phase
        }
    })
}
async function updateLastPhaseTo(tx:Prisma.TransactionClient, value:InterviewPhase, id:number) {
    await tx.interview.update({
        where:{
            id
        },
        data:{
            lastEvaluatedPhase:value
        }
    })
}

async function findInterviewPhase(interviewId:number) {
    const interview = await prisma.interview.findFirst({
        where:{
            id: interviewId 
        },
        select:{
            phase:true
        }
    })
    return interview?.phase
}

async function findInterviewPhaseT(tx:Prisma.TransactionClient,interviewId:number) {
    const interview = await tx.interview.findFirst({
        where:{
            id: interviewId 
        },
        select:{
            phase:true
        }
    })
    return interview?.phase
}

export {updateInterviewPhaseTo, updateLastPhaseTo, findInterviewPhase, findInterviewPhaseT}