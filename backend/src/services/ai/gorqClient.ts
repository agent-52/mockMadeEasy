import Groq from "groq-sdk";
import { GROQ_API_KEY } from "../../config/env";

const groq = new Groq({
    apiKey: GROQ_API_KEY
})

export{groq}