
import { Difficulty, Prisma } from "@prisma/client";
import { evaluateQuestionServiec_ai } from "../services/ai/evaluateQuestionService";
import { EvaluateCodingInput, evaluateCodingQuestionService_ai } from "../services/ai/evaluateCodingQuestionService_ai";


async function evaluateResponse(tx:Prisma.TransactionClient, interviewQuestionId:number, questionId:number, statsCardId:number,  questionText:string, difficulty:Difficulty, timeTaken:number, averageTime:number) {
    
        const result = await tx.userResponse.findFirst({
            where:{
                interviewQuestionId
            },select:{
                response: true,
                id:true,
  
            }
        })
        if(!result){
            return
        }

        const aiEvalInput = {
            questionText,
            userAnswer: result.response,
            difficulty,
            userTimeSeconds: timeTaken,
            averageTimeSeconds: averageTime
        }

        const aiResponse = await evaluateQuestionServiec_ai(aiEvalInput)

        await tx.interviewQuestion.update({
            where:{
                id:interviewQuestionId
            },
            data:{
                clarityScore:aiResponse.clarityScore,
                conceptDepthScore:aiResponse.conceptDepthScore,
                logicalThinkingScore:aiResponse.logicalThinkingScore,
                confidenceScore:aiResponse.confidenceScore,
                overallScore:aiResponse.overallScore,
                idealAnswer:aiResponse.idealAnswer,
                gapAnalysis:aiResponse.gapAnalysis,
                aiFeedback:aiResponse.aiFeedback,
                strengths:aiResponse.strengths,
                areasToImprove:aiResponse.areasToImprove,
                timeInsight :aiResponse.timeInsight,
            }
        })

        const isCorrect = aiResponse.isCorrect 
        if(isCorrect){
            
            await tx.statsCardDetail.update({
                where:{
                    statsCardId_questionId:{statsCardId,questionId}
                },data:{
                    isCorrect:true
                }
            })
        }else{
            
            await tx.statsCardDetail.update({
                where:{
                    statsCardId_questionId:{statsCardId,questionId}
                },data:{
                    isCorrect: false
                }
            })
        }
    
    
}

async function evaluateCodingResponse(tx:Prisma.TransactionClient,interviewQuestionId:number, statsCardDetailId:number, questionText:string, difficulty:Difficulty, timeTaken:number, averageTime:number) {
    const response = await tx.userResponse.findFirst({
        where:{
            interviewQuestionId
        },select:{
            response: true,
            id:true,

        }
    })
    if(!response){
        return 
    }

    //fetch execution result
    const executionResult = await tx.codeExecutionResult.findUnique({
        where:{
            statsCardDetailId
        }
    });
    if(!executionResult){
        throw new Error(`Execution result not found for statCardDetailId:- ${statsCardDetailId}`, )
    }
    //build ai input 
    const aiInput:EvaluateCodingInput = {
        questionText,
        userCode:response.response,
        difficulty,
        userTimeSeconds:timeTaken,
        averageTimeSeconds:averageTime,
        executionResult:{
            passed:executionResult.passed,
            failedTestCases:executionResult.failedCount,
            totalTestCases:executionResult.totalCount,
            error:executionResult.error
        }
    };
    //call ai service
    const aiResponse = await evaluateCodingQuestionService_ai(aiInput)
    //stroe the response in interview quesiton 
    await tx.interviewQuestion.update({
        where:{

            id:interviewQuestionId
        },
        data:{
            codeQualityScore: aiResponse.codeQualityScore,
            correctnessScore: aiResponse.correctnessScore,
            problemSolvingScore: aiResponse.problemSolvingScore,
            overallScore: aiResponse.overallScore,
            idealAnswer: aiResponse.idealApproach,
            gapAnalysis: aiResponse.gapAnalysis,
            aiFeedback: aiResponse.aiFeedback,
            strengths: aiResponse.strengths,
            areasToImprove: aiResponse.areasToImprove,
            timeInsight: aiResponse.timeInsight
        }
    })
    await tx.statsCardDetail.update({
        where:{
            id:statsCardDetailId
        },
        data:{
            isCorrect: aiResponse.isCorrect
        }
    })

}
export {evaluateResponse, evaluateCodingResponse}