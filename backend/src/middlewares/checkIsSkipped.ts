import { prisma } from "../db/db";

async function checkIsSkipped(interviewQuestionId:number) {
    const response = await prisma.interviewQuestion.findUnique({
        where:{
            id:interviewQuestionId,

        },
        select:{
            skipped:true
        }
    })
    if(!response){
        return null
    }
    return response.skipped
}

export{checkIsSkipped}