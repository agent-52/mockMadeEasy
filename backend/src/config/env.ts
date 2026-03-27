
function getJwtSecret():string{
    const secret = process.env.JWT_SECRET
    if(!secret){
        throw new Error("JWT_SECRET is not defined")
    }
    return secret
}
function getDeepgramKey():string{
    const key = process.env.DEEPGRAM_KEY
    if(!key){
        throw new Error("DEEPGRAM_KEY is not defined")
    }
    return key
}
function getGroqKey():string{
    const key = process.env.GROQ_API_KEY
    if(!key){
        throw new Error("GROQ_API_KEY is not defined")
    }
    return key
}

function getOpenAiKey():string{
    const key = process.env.OPENAI_TTS_KEY
    if(!key){
        throw new Error("OPENAI_TTS_KEY is not defined")
    }
    return key
}
function getCloudflareAccountId():string{
    const key = process.env.ACCOUNT_ID
    if(!key){
        throw new Error("ACCOUNT_ID is not defined")
    }
    return key
}
function getECloudflareAccessKeyId():string{
    const key = process.env.ACCESS_KEY_ID
    if(!key){
        throw new Error("ACCESS_KEY_ID is not defined")
    }
    return key
}
function getCloudflareSecretAccessKey():string{
    const key = process.env.SECRET_ACCESS_KEY
    if(!key){
        throw new Error("ESECRET_ACCESS_KEY is not defined")
    }
    return key
}
function getBucketName(){
    const key = process.env.R2_BUCKET_NAME
    if(!key){
        throw new Error("R2_BUCKET_NAME is not defined")
    }
    return key
}
export const DEEPGRAM_KEY = getDeepgramKey()
export const JWT_SECRET = getJwtSecret()
export const GROQ_API_KEY = getGroqKey()
export const OPENAI_TTS_KEY = getOpenAiKey()
export const ACCOUNT_ID = getCloudflareAccountId()
export const ACCESS_KEY_ID = getECloudflareAccessKeyId()
export const SECRET_ACCESS_KEY = getCloudflareSecretAccessKey()
export const R2_BUCKET_NAME = getBucketName()