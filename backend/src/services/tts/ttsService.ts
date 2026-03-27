
import crypto from "crypto"
import { createTtsEntry, findAudioLink } from "../../db/ttsQueries"
import { uploadAudio } from "./cloudStorage"
import { generateTtsBuffer } from "./edgeTts"


async function getOrCreateAudio(text:string) :Promise<string | null>{
    
    const textHash = crypto.createHash("sha256").update(text).digest("hex")
    
    //check if audio exist logic
    let audioLink:string = ""
    try {
        const ttsLink = await findAudioLink(textHash )
        if(ttsLink != null){
            audioLink = ttsLink
            console.log("audioLinkFound:-", audioLink)
            return audioLink
        }
        
    } catch (error) {
        throw new Error("tts search query failed")
    }

    //audio creation logic
    try {
        const audioBuffer = await generateTtsBuffer(text)
        //save it to cloud , get link
        if(!audioBuffer) return null
        const audioUrl = await uploadAudio(audioBuffer, textHash)
        
        //save it to db
        if(audioUrl){
            await createTtsEntry(textHash, text, audioUrl)
        }
        console.log(audioUrl)
        return audioUrl
    } catch (error) {
        console.log("the error on the tts logic is:- ", error)
        return null
    }

    

}


export {getOrCreateAudio}