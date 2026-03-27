import { prisma } from "./db"

async function findInterviewDetails(interviewId:number){
    const response = await prisma.interview.findUnique({
        where: {
            id:interviewId
        },
        select:{
            id:true,
            userId:true,
            roleType:true,
            includeIntro:true,
            subjects:true,
            difficulty:true,
            phase:true,
            lastEvaluatedPhase:true,
            status:true,
            estimatedDuration:true,
            questions:{
                select:{
                    order:true,
                    id:true,
                    question:{
                        select:{
                            id:true,
                            difficulty:true,
                            title:true,
                            description:true,
                            constraints:true,
                            starterCode:true,
                            type:true,
                            topics:{
                                select:{
                                    topic:{
                                        select:{
                                            name:true
                                        }
                                    }
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

async function findInterviewReviewDetails(interviewId:number, statsCardId:number){

    const response = await prisma.interviewQuestion.findMany({
        where:{
            interviewId
        },
        select:{
            id:true,
            skipped:true,
            questionId:true,
            order:true,
            timeTaken:true,
            interview:{
                select:{
                    id:true,
                    startedAt:true,
                    endedAt:true,
                    
                }
            },
            question:{
                select:{
                    type:true,
                    title:true,
                    description:true,
                    difficulty:true,
                    topics:{
                        select:{
                            topic:{
                                select:{
                                    name:true
                                }
                            }
                        }
                    },
                    statsCardDetails:{
                        where:{
                            statsCardId
                        },
                        select:{
                            id:true,
                            isCorrect:true,
                            codeExecutionResult:{
                                select:{
                                    passed:true,
                                    error:true
                                }
                            }
                        }
                    }
                }
            },
            response:{
                select:{
                    response:true,
                    attemptedAt:true,
                }
            },
        },
        orderBy:{
            order:"asc"
        }
    })
    

    return response
}

export {findInterviewDetails, findInterviewReviewDetails}