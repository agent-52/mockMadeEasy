import { Difficulty } from "@prisma/client";
import { groq } from "./gorqClient";
import z from "zod";



type EvaluateQuestionInput = {
  questionText: string
  userAnswer: string
  difficulty: "easy" | "medium" | "hard"
  userTimeSeconds: number
  averageTimeSeconds: number
}
type EvaluateQuestionOutput = {
  clarityScore: number
  conceptDepthScore: number
  logicalThinkingScore: number
  confidenceScore: number
  codeStructureScore: number | null
  overallScore: number
  isCorrect: boolean

  idealAnswer: string
  gapAnalysis: string
  aiFeedback: string

  strengths: string[]
  areasToImprove: string[]

  timeInsight: {
    userTimeSeconds: number
    averageTimeSeconds: number
    percentageDifference:number
    comparisonLabel:string
  }
}

type AiResponse = {
    clarityScore: number,
    conceptDepthScore: number,
    logicalThinkingScore: number,
    confidenceScore: number,
    codeStructureScore: number | null,
    overallScore: number,
    idealAnswer: string,
    gapAnalysis: string,
    aiFeedback: string,
    strengths: string[],
    areasToImprove: string[]
}

const  aiResponseSchema = z.object({
    
    clarityScore: z.number().min(0).max(10),
    conceptDepthScore: z.number(),
    logicalThinkingScore: z.number(),
    confidenceScore: z.number(),
    codeStructureScore: z.number().nullable(),
    overallScore: z.number().min(0).max(100),

    idealAnswer: z.string(),
    gapAnalysis: z.string(),
    aiFeedback: z.string(),
    strengths: z.array(z.string()),
    areasToImprove: z.array(z.string())
    
})

const systemPrompt = `
You are a senior technical interviewer evaluating a candidate.

    Score each of the following on a scale of 0–10:
    - clarityScore
    - conceptDepthScore
    - logicalThinkingScore
    - confidenceScore
    - codeStructureScore (if applicable)

    Compute overallScore from 0–100.

    Do NOT include any explanation text.
    Do NOT wrap in markdown.
    Return ONLY raw JSON.
    If you include anything other than JSON, the system will crash.

    Return only valid JSON in this format:
    {
    clarityScore: number,
    conceptDepthScore: number,
    logicalThinkingScore: number,
    confidenceScore: number,
    codeStructureScore: number | null,
    overallScore: number,
    idealAnswer: string,
    gapAnalysis: string,
    aiFeedback: string,
    strengths: string[],
    areasToImprove: string[]
    }
`

function generateUserPrompt(question:string, answer:string, userTime:number, averageTime:number){
    return (
        `
        Question: ${question}
        
        User Answer: ${answer}
        

        User took ${userTime} seconds.
        Average time is ${averageTime} seconds.
        `
    )
}

function extractJSON(raw: string) {
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) throw new Error("No JSON found in AI response")
  return JSON.parse(match[0])
}
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function findComparisonLabelAndPercentDifference(avgTime:number, userTime:number){
    const percentageDifference = ((avgTime-userTime)/avgTime)*100;
    let comparisonLabel:string = `matched average time`;
    if(Math.abs(percentageDifference)<10){
        comparisonLabel = `matched average time`
    }
    else if(percentageDifference>0){
        comparisonLabel = `${percentageDifference} faster than average`
    }else if(percentageDifference<0){
        comparisonLabel = `${percentageDifference} slower than average`
    }

    return {percentageDifference, comparisonLabel}
}

function buildFinalResponse(validated:AiResponse, input:EvaluateQuestionInput): EvaluateQuestionOutput {
    const {percentageDifference, comparisonLabel} = findComparisonLabelAndPercentDifference(input.averageTimeSeconds, input.userTimeSeconds)
  return {
    clarityScore: Math.min(validated.clarityScore, 10),
    conceptDepthScore: Math.min(validated.conceptDepthScore, 10),
    logicalThinkingScore: Math.min(validated.logicalThinkingScore,10),
    confidenceScore: Math.min(validated.confidenceScore,10),
    codeStructureScore: validated.codeStructureScore,
    overallScore: Math.min(validated.overallScore, 100),
    isCorrect: (validated.overallScore>60?true:false),

    idealAnswer: validated.idealAnswer,
    gapAnalysis: validated.gapAnalysis,
    aiFeedback: validated.aiFeedback,

    strengths: validated.strengths,
    areasToImprove: validated.areasToImprove,

    timeInsight: {
        userTimeSeconds: input.userTimeSeconds,
        averageTimeSeconds: input.averageTimeSeconds,
        percentageDifference,
        comparisonLabel
    }
  }
}

function buildFallbackResponse(input: EvaluateQuestionInput): EvaluateQuestionOutput {
    const {percentageDifference, comparisonLabel} = findComparisonLabelAndPercentDifference(input.averageTimeSeconds, input.userTimeSeconds)
    return {
        clarityScore: 0,
        conceptDepthScore: 0,
        logicalThinkingScore: 0,
        confidenceScore: 0,
        codeStructureScore: null,
        overallScore: 0,
        isCorrect: false,
        idealAnswer: "AI evaluation temporarily unavailable.",
        gapAnalysis: "Could not analyze answer due to a processing issue.",
        aiFeedback: "Please try again later.",
        strengths: [],
        areasToImprove: [],
        timeInsight: {
        userTimeSeconds: input.userTimeSeconds,
        averageTimeSeconds: input.averageTimeSeconds,
        percentageDifference,
        comparisonLabel
        }
    }
}


async function evaluateQuestionServiec_ai(input:EvaluateQuestionInput):Promise<EvaluateQuestionOutput> {
    const MAX_RETRIES = 3

    for(let attempt = 1; attempt<=MAX_RETRIES; attempt++){
        try {
            //evaluation attempt
            const completion = await groq.chat.completions.create({
                messages:[
                    {
                        role:"system",
                        content:(attempt==1?systemPrompt:systemPrompt+`Your previous response was invalid JSON.
                        Return ONLY raw JSON.`)
                    },
                    {
                        role:"user",
                        content: generateUserPrompt(input.questionText, input.userAnswer, input.userTimeSeconds, input.averageTimeSeconds)
                    }
                ],
                model:"llama-3.3-70b-versatile",
                temperature: 0.2,
                max_tokens:1500,
                response_format:{type:"json_object"}
            })

            //response validation
            const raw = completion.choices[0]?.message.content?.trim()
            if(!raw){
                throw new Error("NO RAW JSON CAME FROM AI")
            }
            
            const extracted = extractJSON(raw)
            const parsed = aiResponseSchema.safeParse(extracted)
            if(!parsed.success){
                throw new Error("Ai response zod validation failed")
            }

            return buildFinalResponse(parsed.data, input)
            
        } catch (error) {
            console.error(`AI attempt ${attempt} failed`, error)

            if(attempt === MAX_RETRIES){
                return buildFallbackResponse(input)
            }

            await delay(300) //wait before retry
        }
    }

    return buildFallbackResponse(input)
    
    
}

export {evaluateQuestionServiec_ai, extractJSON, delay}