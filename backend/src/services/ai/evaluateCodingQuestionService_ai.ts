import z, { json, promise } from "zod"
import { groq } from "./gorqClient"
import { delay, extractJSON, findComparisonLabelAndPercentDifference } from "./evaluateQuestionService"
import { Difficulty } from "@prisma/client"


export type EvaluateCodingInput = {
  questionText: string,
  userCode: string
  difficulty: Difficulty
  userTimeSeconds: number
  averageTimeSeconds: number

  executionResult?: {
    passed: boolean
    failedTestCases?: number
    totalTestCases?: number
    error?: string | null
  }
}

type EvaluateCodingOutput = {
 correctnessScore: number            // 0–10
  codeQualityScore: number            // 0–10
  problemSolvingScore: number         // 0–10
  overallScore: number                // 0–100
  isCorrect: boolean

  idealApproach: string
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
  "correctnessScore": number,
  "codeQualityScore": number,
  "problemSolvingScore": number,
  "idealApproach": string,
  "gapAnalysis": string,
  "aiFeedback": string,
  "strengths": string[],
  "areasToImprove": string[]
}
const aiResponseSchema = z.object({
  "correctnessScore": z.number().min(0).max(10),
  "codeQualityScore": z.number().min(0).max(10),
  "problemSolvingScore": z.number().min(0).max(10),
  "idealApproach": z.string(),
  "gapAnalysis": z.string(),
  "aiFeedback": z.string(),
  "strengths": z.array(z.string()).catch([]),
  "areasToImprove": z.array(z.string()).catch([])
})

const systemPrompt = `
You are a senior technical interviewer evaluating a coding interview response.

The execution results are authoritative. If tests failed, the solution is not fully correct.

You must return ONLY valid raw JSON.
Do NOT include markdown.
Do NOT include commentary outside JSON.
If the format is incorrect, the system will crash.

Return JSON in exactly this format:

{
  "correctnessScore": number,
  "codeQualityScore": number,
  "problemSolvingScore": number,
  "idealApproach": string,
  "gapAnalysis": string,
  "aiFeedback": string,
  "strengths": string[],
  "areasToImprove": string[]
}

Instructions:

1. correctnessScore (0–10):
   - 10 if fully correct and passes all test cases.
   - Lower if edge cases missing.
   - Very low if logic incorrect.

2. codeQualityScore (0–10):
   - Readability
   - Naming
   - Structure
   - Modularity

3. problemSolvingScore (0–10):
   - Algorithm choice
   - Efficiency
   - Handling of edge cases
   - Logical structure

4. Strengths:
   - Return exactly 3–5 concise strengths.
   - Based only on observed code.

5. areasToImprove:
   - Return exactly 3–5 actionable areasToImprove.

Be constructive but realistic.
Return only JSON.
`

function userPrompt(input:EvaluateCodingInput){
    

    return (
        `
        Question:
        ${input.questionText}

        User Code:
        ${input.userCode}

        Difficulty: ${input.difficulty}

        Execution Result:
        Passed: ${input.executionResult?.passed}
        Failed Test Cases: ${input.executionResult?.failedTestCases ?? 0}
        Total Test Cases: ${input.executionResult?.totalTestCases ?? 0}
        Error Message: ${input.executionResult?.error ?? "None"}

        User Time: ${input.userTimeSeconds} seconds
        Average Time: ${input.averageTimeSeconds} seconds

        `
    )
}

function buildFinalResponse(validatedData:AiResponse, input:EvaluateCodingInput):EvaluateCodingOutput{
    const {percentageDifference, comparisonLabel} = findComparisonLabelAndPercentDifference(input.averageTimeSeconds, input.userTimeSeconds)
    const overallScore = (validatedData.correctnessScore*0.5+validatedData.problemSolvingScore*0.3+validatedData.codeQualityScore*0.2)*10
    let isCorrect:boolean = false;
    if(input.executionResult?.passed == true){
        isCorrect = true
    }
    return {
        correctnessScore: validatedData.correctnessScore,          // 0–10
        codeQualityScore: validatedData.codeQualityScore,            // 0–10
        problemSolvingScore: validatedData.problemSolvingScore,         // 0–10
        overallScore,                // 0–100
        isCorrect,

        idealApproach: validatedData.idealApproach,
        gapAnalysis: validatedData.gapAnalysis,
        aiFeedback: validatedData.aiFeedback,

        strengths: validatedData.strengths,
        areasToImprove: validatedData.areasToImprove,

        timeInsight: {
            userTimeSeconds: input.userTimeSeconds,
            averageTimeSeconds: input.averageTimeSeconds,
            percentageDifference,
            comparisonLabel
        }
    }
}

function buildFallBackResponse(input:EvaluateCodingInput){
    const {percentageDifference, comparisonLabel} = findComparisonLabelAndPercentDifference(input.averageTimeSeconds, input.userTimeSeconds)
    let isCorrect:boolean = false;
    if(input.executionResult?.passed == true){
        isCorrect = true
    }
    return {
        correctnessScore: 0,          // 0–10
        codeQualityScore: 0,            // 0–10
        problemSolvingScore: 0,         // 0–10
        overallScore: 0,                // 0–100
        isCorrect ,

        idealApproach: "ai evaluation not avialabel",
        gapAnalysis: "ai evaluation not availabel",
        aiFeedback: "ai evaluation not availabel",

        strengths: ["ai evaluation not avialabel"],
        areasToImprove: ["ai evaluation not avialabel"],

        timeInsight: {
            userTimeSeconds: input.userTimeSeconds,
            averageTimeSeconds: input.averageTimeSeconds,
            percentageDifference,
            comparisonLabel
        }
    }
}


async function evaluateCodingQuestionService_ai(input:EvaluateCodingInput) {
    const MAX_ATTEMPT = 3
    for (let attempt = 1; attempt <= MAX_ATTEMPT; attempt++) {
        
        try{
            const completion = await groq.chat.completions.create({
                messages:[
                    {
                        role:"system",
                        content:(attempt == 1?systemPrompt:systemPrompt+`Your previous response was invalid JSON.
                        Return ONLY raw JSON.`)
                    },
                    {
                        role:"user",
                        content:userPrompt(input)
                    }
                ],
                model:"llama-3.3-70b-versatile",
                temperature:0.2,
                max_tokens:1500,
                response_format:{type:"json_object"}
            })

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

        }catch(error){
            console.error(`AI attempt ${attempt} failed`, error)

            if(attempt === MAX_ATTEMPT){
                return buildFallBackResponse(input)
            }

            await delay(300) //wait before retry
        }   
    }

    return buildFallBackResponse(input)

}

export{evaluateCodingQuestionService_ai}