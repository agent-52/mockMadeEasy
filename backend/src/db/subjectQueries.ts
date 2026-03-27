import { Prisma, SubjectType } from '@prisma/client';
import { prisma } from './db';

async function findSubject(tx:Prisma.TransactionClient, topicName:string) {
    const response = await tx.subject.findFirst({
        where:{
            topics:{
                some:{
                    name: topicName
                }
            }
        }
    })
    return response
}



export {findSubject}