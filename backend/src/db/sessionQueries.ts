import { Difficulty, InterviewRole, Subject, SubjectType } from "@prisma/client"
import { prisma } from "./db"

async function getPastSessions(userId:number, whereObject:{
    roleType?:InterviewRole,
    difficulty?:Difficulty,
    subjects?:SubjectType[],
    daysAgo?:Date
    sortByScore?:"asc"|"desc"
    }, limit:number, skip:number) {
    const total = await prisma.interview.count({
        where:{
            userId:userId,
            ...(whereObject.roleType && {roleType:whereObject.roleType}),
            ...(whereObject.difficulty && {difficulty:whereObject.difficulty}),
            ...(whereObject.subjects && {
                subjects:{
                    hasSome: whereObject.subjects
                }
            }),
            ...(whereObject.daysAgo && {
                startedAt:{
                    gte: whereObject.daysAgo
                }
            })
        }
    })
    const response = await prisma.interview.findMany({
        where:{
            userId:userId,
            ...(whereObject.roleType && {roleType:whereObject.roleType}),
            ...(whereObject.difficulty && {difficulty:whereObject.difficulty}),
            ...(whereObject.subjects && {
                subjects:{
                    hasSome: whereObject.subjects
                }
            }),
            ...(whereObject.daysAgo && {
                startedAt:{
                    gte: whereObject.daysAgo
                }
            })
        },
        ...(!whereObject.sortByScore && {orderBy:{startedAt:"desc"}}),
        ...(whereObject.sortByScore && {orderBy:{
            statsCards:{
                accuracy: whereObject.sortByScore
            }
        }}),
        ...(limit && {take:limit}),
        skip:skip,
        select:{
            id:true,
            roleType:true,
            subjects:true,
            difficulty:true,
            phase:true,
            status:true,
            startedAt:true,
            endedAt:true,
            statsCards:{
                select:{
                    totalAttempted:true,
                    totalCorrect:true,
                    accuracy:true,
                    details:{
                        select:{
                            questionId:true
                        }
                    }
                }
            },
            questions:{
                select:{
                    question:{
                        select:{
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

    return {response, total}
}

export {getPastSessions}