import { prisma } from "./db";
import { Difficulty, InterviewRole, Mode, Status, SubjectType } from "@prisma/client";

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    const temp = array[i]!
    array[i] = array[j]!
    array[j] = temp
  }
  return array
}


export async function createInterviewRecord(userId:number, difficulty:Difficulty, roleType:InterviewRole, subjects:SubjectType[], selectedQuestions:any[]){
    
    

    return await prisma.$transaction(async (tx) =>{
        const interview = await tx.interview.create({
            data:{
                subjects: subjects,
                roleType,
                difficulty,
                status:Status.active,
                userId:userId
            }
        })

        const mapping = selectedQuestions.map((q, index) => ({interviewId: interview.id, questionId: q.id, order: index+1}))

        const mapQuestionsToInterview = await tx.interviewQuestion.createMany({
            data: mapping
        })

        return interview;
    })
}