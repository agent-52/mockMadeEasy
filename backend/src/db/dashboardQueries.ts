import { prisma } from "./db";
import { Prisma } from '@prisma/client';

async function findOngoingInterview(userId:number) {
    const response = await prisma.interview.findMany({
        where:{
            userId,
            phase:{
                not:"completed"
            }
        },
        orderBy:{
            startedAt:"desc"
        }
    })
    return response
}

async function findCompletedInterviews( userId:number) {
    const response = await prisma.interview.findMany({
        where:{
            userId,
            phase:"completed"
        },
        select:{
            id:true,
            subjects:true,
            statsCards:{
                select:{
                    accuracy:true,
                    details:true
                }
            },
            questions:{
                select:{
                    questionId:true,
                    skipped:true,
                    timeTaken:true,
                    question:{
                        select:{
                            topics:{
                                select:{
                                    topic:{
                                        select:{
                                            subjectId:true,
                                            id:true,
                                            name:true,
                                            subject:true
                                        }
                                    }
                                    
                                }
                            }
                        }
                    }
                }
            }
        },
        orderBy:{
            startedAt:"desc"
        }
    })
    return response
}

async function countSessionsAboveADate(userId:number, date:Date) {
    const count = await prisma.interview.count({
        where:{
            userId,
            startedAt:{
                gte: date
            }
        }
    })
    return count
}

export {findOngoingInterview, findCompletedInterviews, countSessionsAboveADate}