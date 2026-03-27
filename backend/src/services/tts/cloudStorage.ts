import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ACCESS_KEY_ID, ACCOUNT_ID, R2_BUCKET_NAME, SECRET_ACCESS_KEY } from "../../config/env";


const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials:{
        accessKeyId:ACCESS_KEY_ID,
        secretAccessKey:SECRET_ACCESS_KEY
    }
})

async function uploadAudio(audioBuffer:Buffer, textHash:string):Promise<string> {

    try {
        //file path - s3 key
        const fileKey = `tts/${textHash}.mp3`

        //uploading to r2
        await r2.send(
            new PutObjectCommand({
                Bucket:R2_BUCKET_NAME,
                Key: fileKey,
                Body: audioBuffer,
                ContentType: "audio/mpeg",
                CacheControl: "public, max-age=31536000",
                ContentDisposition: "inline"
            })
        )


        const publicUrl = `https://pub-ab2ac98047934cd4981fa9079bee7556.r2.dev/${fileKey}`

        return publicUrl
    } catch (error) {
       console.error("R2 upload failed:", error)
        throw new Error("Audio upload failed") 
    }

}

export {
    uploadAudio
}