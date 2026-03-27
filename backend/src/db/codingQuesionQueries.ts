import { prisma } from "./db";

async function findCodingQuestions(interviewId:number, statsCardId:number) {
    const response = await prisma.interviewQuestion.findMany({
        where:{
            interviewId,
            question:{
                type:"coding"
            }
        },
        select:{
            id:true,
            questionId:true,
            timeTaken:true,
            question:{
                select:{
                    title:true,
                    difficulty:true,
                    averageTime:true,
                    statsCardDetails:{
                        where:{statsCardId},
                        select:{
                            id:true,
                            codeExecutionResult:true

                        }
                    }
                }
            }
        }
    })
    return response
}

async function findCodingStatus(interviewId:number, statsCardId:number) {
    
    const questions = await findCodingQuestions(interviewId, statsCardId)
    if(questions.length == 0){
        return {
            "canEvaluateCode":false,
            "codingEvaluated":false
        }
    }
    const hasPending = questions.some(q =>
        q.question.statsCardDetails[0]?.codeExecutionResult?.error === "Not evaluated yet")

    if(!hasPending){
        return {
            "canEvaluateCode":false,
            "codingEvaluated":true
        }
    }else{
        return {
            "canEvaluateCode":true,
            "codingEvaluated":false
        }

    }

}


export {findCodingQuestions, findCodingStatus}