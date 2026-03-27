import { Prisma } from "@prisma/client";
import { prisma } from "./db";

async function markInterviewComplete(tx:Prisma.TransactionClient ,interviewId:number) {
    const response = await tx.interview.update({
        where:{
            id:interviewId
        },
        data:{
            endedAt: new Date()
        }
    })
    
}

export {markInterviewComplete}