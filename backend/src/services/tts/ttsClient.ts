import OpenAI from "openai";
import { OPENAI_TTS_KEY } from "../../config/env";

export const openai = new OpenAI({
    apiKey: OPENAI_TTS_KEY
})