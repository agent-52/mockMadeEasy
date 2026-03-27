import { prisma } from "./db";

async function findAudioLink(hashText:string) {
    const response = await prisma.ttsCache.findUnique({
        where:{
            textHash:hashText
        },
        
    })
    return response?.audioUrl
}

async function createTtsEntry(textHash:string, text:string, audioUrl:string) {
    const response = await prisma.ttsCache.upsert({
        where:{textHash},
        update:{},
        create:{
            text,
            textHash,
            audioUrl
        }
    })
}
export {findAudioLink, createTtsEntry}
