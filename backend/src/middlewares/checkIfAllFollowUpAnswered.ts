import { prisma } from "../db/db";

async function checkIfAllFollowUpAnswered(interviewId:number) {
    const response = await prisma.interviewQuestion.findFirst({
        where:{
            interviewId,
            question:{
                followUpToQuesitonId:{not: null},
                
            },
            response:null,
            skipped:false
            
            
        },
    })
    return response === null
}

export {checkIfAllFollowUpAnswered}