import { prisma } from "./db";


export async function getSubjects() {
    const response = await prisma.subject.findMany()
    return response
}

export async function getTopicsBySubject(subjectId:number) {
    const response = await prisma.subject.findUnique({
        where:{
            id:subjectId
        },
        select:{
            topics:{
                select:{
                    id:true,
                    name:true
                }
            }
        }
    })
    return response?.topics
}