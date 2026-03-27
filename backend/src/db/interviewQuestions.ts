import { Difficulty, InterviewPhase, Prisma, SubjectType } from "@prisma/client";
import { prisma } from "./db";

async function findInterviewQuestions(interviewId:number){
    const questions = await prisma.interviewQuestion.findMany({
        where:{
            interviewId
        },
        
        select:{
            id: true,
            order:true,
            skipped:true,
            question: {
                select:{
                    
                    id: true,
                    title: true,
                    description: true,
                    difficulty: true,
                    type:true,
                }
            },
            interview:{
                select:{
                    phase:true
                }
            }
        },
        orderBy:{order: 'asc'}
        
    })
    return questions

}
async function findInterviewQuestionsByPhase( interviewId:number, phase:InterviewPhase) {
    const questions = await prisma.interviewQuestion.findMany({
        where:{
            interviewId,
            question: (phase === "base") ? {followUpToQuesitonId:null}:
            {followUpToQuesitonId:{not: null}},
            skipped:false
        },
        include:{
            question:true
        },
        orderBy:{
            order:"asc"
        }
    })
    return questions
}

async function findTotalQuestionsbyPhase(tx:Prisma.TransactionClient, interviewId:number, phase:InterviewPhase) {
    const questions = await prisma.interviewQuestion.count({
        where:{
            interviewId,
            question: (phase === "base") ? {followUpToQuesitonId:null}:
            {followUpToQuesitonId:{not: null}},
            skipped:false
        },
        orderBy:{
            order:"asc"
        }
    })
    return questions
}

async function findInterviewQuestionId(interviewId:number, questionId:number) {
    const response = await prisma.interviewQuestion.findUnique({
        where:{
            interviewId_questionId:{
                interviewId:interviewId,
                questionId:questionId
            }
        },
        select:{
            id:true
        }
    })
    return response?.id
}

async function findAvailableQuestions(difficulty:Difficulty, subjects:SubjectType[], topicIds?:number[]) {
    const response = await prisma.question.findMany({
        where:{
            difficulty,
            followUpToQuesitonId : null,
            topics:{
                some:{
                    topic:{
                        
                        subject:{
                            title:{
                                in: subjects
                            }
                        },
                        ...(topicIds && topicIds.length > 0 ?{
                                topicId: {in : topicIds}
                            }:{}),
                    }
                }
            }
        },
        select:{
            id:true,
            title:true,
            type:true,
            topics:{
                select:{
                    topic:{
                        select:{
                            id:true,
                            subject:{
                                select:{
                                    title:true
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    return response
}

async function findNextInterviewQuesiton(tx:Prisma.TransactionClient, interviewId:number, nextQuestionOrder:number) {
    const response = await tx.interviewQuestion.findFirst({
        where:{
            interviewId,
            order:nextQuestionOrder
        },
        select:{
            id:true,
            question:true
        }
    })
    return response
}

async function findFirstUnansweredQuestion(interviewId:number, phase:string) {
    const questions = await prisma.interviewQuestion.findMany({
        where:{
            interviewId,
            question: (phase === "base") ? {followUpToQuesitonId:null}:
            {followUpToQuesitonId:{not: null}},
            skipped:false,
            response: null
        },
        include:{
            question:true
        },
        orderBy:{
            order:"asc"
        }
    })
    return questions[0]
}


export {findInterviewQuestions, findInterviewQuestionsByPhase, findInterviewQuestionId, findAvailableQuestions, findNextInterviewQuesiton, findFirstUnansweredQuestion, findTotalQuestionsbyPhase}