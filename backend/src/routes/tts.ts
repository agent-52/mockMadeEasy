import express from 'express';
import { getOrCreateAudio } from '../services/tts/ttsService';

const ttsRouter = express.Router()

ttsRouter.post("/", async(req, res) => {
    const reqBody = req.body
    const text:string = reqBody.text
    const voiceId = reqBody.voiceId

    if(!text){
        return res.status(400).json({

            message:'no text in request body for tts conversion'
        })
    }

    try {
        const audioUrl = await getOrCreateAudio(text)
        return res.status(200).json({
            audioUrl
        })
    } catch (error) {
        console.log("error occured during getOrCreateAudio function :- ", error)
        return res.status(500).json({
            message:"there was an errro on tts route :- ", error
        })
    }
})