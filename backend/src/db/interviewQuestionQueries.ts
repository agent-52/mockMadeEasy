import { prisma } from "./db";

async function findInterviewQuestionId(interviewId:number, questionId:number) {
    const ans = await prisma.interviewQuestion.findUnique({
        where:{
            interviewId_questionId:{
                interviewId,
                questionId
            }
        },select:{
            id:true
        }
    })
    if(ans){
        return ans.id
    }else{
        return null
    }
}



export {findInterviewQuestionId}