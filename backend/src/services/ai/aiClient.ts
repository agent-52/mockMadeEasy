import { groq } from "./gorqClient"

const DEFAULT_MODEL = "llama3-8b-8192"
const FALLBACK_MODEL = "mixtral-8x7b"
const DEFAULT_TEMPERATURE = 0.2
const MAX_RETRIES = 3
const DEFAULT_MAX_TOKENS = 1500
const MAX_PROMPT_CHAR_LIMIT = 10000


const aiClient = {
    validatePrompt: (prompt: string) => {
        //token budget control
        if(prompt.length > MAX_PROMPT_CHAR_LIMIT){
            throw new Error("Prompt too large")
        }
    }
}
//retry + validation engine
