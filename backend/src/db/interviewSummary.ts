import { EvaluateInterviewOutput } from "../services/ai/evaluateInterviewService_ai";
import { prisma } from "./db";

async function findInterviewSummaryBase(interviewId:number) {
    const response = await prisma.interview.findUnique({
        where:{
            id:interviewId
        },
        select:{
            
            communicationClarity:true,
            
            conceptDepth:true,
            logicalThinking:true,
            confidenceLevel:true,
            codeStructure:true,
            strengths :true,
            areasToImprove:true,
            recommendedFocus:true,
            aiSummaryGenerated:true,
            id:true,
            roleType:true,
            subjects:true,
            difficulty:true,
            startedAt:true,
            endedAt:true,
            statsCards:{
                select:{
                    totalAttempted:true,
                    totalCorrect:true,
                    details:{
                        select:{
                            questionId:true,
                            isCorrect:true,
                            codeExecutionResult:true
                        }
                    }
                }
            },
            questions:{
                select:{
                    correctnessScore:true,
                    problemSolvingScore:true,
                    codeQualityScore:true,
                    clarityScore:true,
                    conceptDepthScore:true,
                    logicalThinkingScore:true,
                    confidenceScore:true,
                    questionId:true,
                    timeTaken:true,
                    skipped:true,
                    strengths:true,
                    areasToImprove:true,
                    
                    question:{
                        select:{
                            type:true,
                            topics:{
                                select:{
                                    topic:{
                                        select:{
                                            id:true,
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
    return response;
}

async function updateInterviewSummary(interviewId:number,aiOutput:EvaluateInterviewOutput) {
    const response = await prisma.interview.update({
        where:{
            id: interviewId
        },
        data:{
            ...aiOutput,
            aiSummaryGenerated:true
        }
    })
    return response
}

export{findInterviewSummaryBase, updateInterviewSummary}