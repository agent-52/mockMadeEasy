import z, { json, promise } from "zod"
import { groq } from "./gorqClient"
import { delay, extractJSON } from "./evaluateQuestionService"

type TopicBreakdownInput = {
    topic:string,
    accuracy:number,
    avgTime:number
}
export type EvaluateInterviewInput = {
  roleType: string
  subjects: string[]
  difficulty: string
  totalQuestions: number
  accuracyPercent: number

  avgScores: {
    clarity: number
    conceptDepth: number
    logicalThinking: number
    confidence: number
    codeScores: {
        averageCorrectnessScore?:number
        averageProblemSolvingScore?:number
        averageCodeQualityScore?:number
    } | null
  }

  topicBreakdown:TopicBreakdownInput[]

  strengths: string[]        // capped to 20
  areasToImprove: string[]     // capped to 20

}

export type EvaluateInterviewOutput = {
  communicationClarity: string
  conceptDepth: string
  logicalThinking: string
  confidenceLevel: string
  codeStructure: string | null

  strengths: string[]
  areasToImprove: string[]
  recommendedFocus: string[]
}

const aiResponseSchema = z.object({
  communicationClarity: z.string(),
  conceptDepth: z.string(),
  logicalThinking: z.string(),
  confidenceLevel: z.string(),
  codeStructure: z.string().nullable(),
  strengths: z.array(z.string()).catch([]),
  areasToImprove: z.array(z.string()).catch([]),
  recommendedFocus: z.array(z.string()).catch([])
})

const systemPrompt = `You are a senior technical interviewer generating a final interview performance summary.

You are given:
- Aggregated performance scores
- Topic-level accuracy breakdown
- Extracted strengths
- Extracted areas for improvement

Your job is to generate a realistic, grounded, and constructive interview report.

STRICT RULES:

- Do NOT invent weaknesses that are not supported by the provided data.
- If a topic has low accuracy (<50%), it should influence AreasToImprove and RecommendedFocus.
- If a topic has high accuracy (>75%), it may influence Strengths.
- Use average score signals to influence tone (e.g., low clarity score → mention communication refinement).
- RecommendedFocus must be short topic-style labels (2–4 words).
- Do NOT output markdown.
- Return ONLY valid raw JSON.
- If JSON is invalid, the system will crash.

Return JSON in EXACT format:

{
  "communicationClarity": string,
  "conceptDepth": string,
  "logicalThinking": string,
  "confidenceLevel": string,
  "codeStructure": string | null,
  "strengths": string[],
  "areasToImprove": string[],
  "recommendedFocus": string[]
}`

function userPrompt(input:EvaluateInterviewInput){
    const strengthsToSend = input.strengths.slice(0, 20)
    const strengthsArrayAsBulletList = strengthsToSend.map((s) => `- ${s}`).join("\n")
    input.topicBreakdown.sort((a,b) => a.accuracy-b.accuracy)
    const areasToImproveToSend = input.areasToImprove.slice(0, 20)
    const areasToImproveArrayAsBulletList = areasToImproveToSend.map(i => `- ${i}`).join("\n")
    const topicList = input.topicBreakdown.map(t => `- ${t.topic}: ${t.accuracy.toFixed(1)}% accuracy, avgTime ${t.avgTime.toFixed(1)}s`).join("\n")
    return (
        `
        Interview Context:

        Role Type: ${input.roleType}
        Subjects: ${input.subjects.join(", ")}
        Difficulty: ${input.difficulty}
        Total Questions: ${input.totalQuestions}
        Accuracy Percentage: ${input.accuracyPercent}%

        Average Scores (0-10 scale):
        - Clarity: ${input.avgScores.clarity}
        - Concept Depth: ${input.avgScores.conceptDepth}
        - Logical Thinking: ${input.avgScores.logicalThinking}
        - Confidence: ${input.avgScores.confidence}
        - Code Structure: ${input.avgScores.codeScores?JSON.stringify(input.avgScores.codeScores) : "Not Applicable"}

        Topic-Level Performance:
        ${topicList}

        Collected Strengths:
        ${strengthsArrayAsBulletList}

        Collected Areas to Improve:
        ${areasToImproveArrayAsBulletList}
        `
    )
}

function buildFallBackResponse(input:EvaluateInterviewInput):EvaluateInterviewOutput{
    return {
    communicationClarity: "Overall performance summary unavailable.",
    conceptDepth: "Detailed evaluation unavailable.",
    logicalThinking: "Detailed evaluation unavailable.",
    confidenceLevel: "Detailed evaluation unavailable.",
    codeStructure: null,
    strengths: input.strengths.slice(0,4),
    areasToImprove: input.areasToImprove.slice(0,4),
    recommendedFocus: ["Core fundamentals", "Concept clarity"]
    }
}


async function evaluateInterviewService_ai(input:EvaluateInterviewInput):Promise<EvaluateInterviewOutput> {
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

            const responseObject = {
                communicationClarity: parsed.data.communicationClarity,
                conceptDepth: parsed.data.conceptDepth,
                logicalThinking: parsed.data.logicalThinking,
                confidenceLevel: parsed.data.confidenceLevel,
                codeStructure: parsed.data.codeStructure,

                strengths: parsed.data.strengths,
                areasToImprove: parsed.data.areasToImprove,
                recommendedFocus: parsed.data.recommendedFocus
            }
            console.log(responseObject)
            return responseObject

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

export{evaluateInterviewService_ai}