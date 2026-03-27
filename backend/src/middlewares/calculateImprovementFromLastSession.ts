import { InterviewPhase, Status } from "@prisma/client"
import { prisma } from "../db/db"

async function calculateImporvementFromLastSession(userId:number, interviewid:number) {
    
    const currentSession = await prisma.interview.findUnique({
        where:{
            id:interviewid
        },
        select:{
            startedAt:true,
            statsCards:{
                select:{
                    accuracy:true
                }
            }
        }
    })

    if(currentSession){
        const lastSession = await prisma.interview.findFirst({
            where:{
                userId,
                phase:InterviewPhase.completed,
                startedAt:{
                    lt:currentSession.startedAt
                }
            },
            orderBy:{
                startedAt:"desc"
            },
            select:{
                statsCards:{
                    select:{
                        accuracy:true
                    }
                }
            }
        })

        if(lastSession?.statsCards && currentSession.statsCards){
            const imporvementPercent = lastSession?.statsCards?.accuracy-currentSession.statsCards?.accuracy

            return imporvementPercent
        }
        
    }

    
}

export {calculateImporvementFromLastSession}