import { Language } from "@prisma/client";
import { prisma } from "./db";
import { findNextQuestionOrder } from "./interviewProgress";

async function createUserResponse(tx:any, interviewQuestionId:number, response: string, interviewId:number, language?:Language) {
    try {
        const result  = await tx.userResponse.findFirst({
            where:{
                interviewQuestionId
            }
        })
        if(result){
            throw new Error("ALREADY_ANSWERED")
        }
    } catch(error){
        console.log("uer response creation failed"+error)
    }
    try {
        const result = await findNextQuestionOrder(tx, interviewId)
        if(result == null){
            throw new Error("INTERVIEW_COMPLETED")
        }
    } catch (error) {
        console.log("uer response creation failed"+error)
    }
    try {

        const result = await tx.userResponse.create({
            data:{
                response,
                interviewQuestionId,
                ...(language && {language})
            }
        })
        return result
    } catch (error) {
        console.log("uer response creation failed"+error)
    }
}

export {createUserResponse}