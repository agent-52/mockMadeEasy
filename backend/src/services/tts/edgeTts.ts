import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts"

export async function generateTtsBuffer(text: string) {
  try {
    const tts = new MsEdgeTTS()

    await tts.setMetadata("en-US-GuyNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3)

    const { audioStream } = await tts.toStream(text)

    const chunks: Buffer[] = []

    await new Promise<void>((resolve, reject) => {
      audioStream.on("data", (chunk) => {
        chunks.push(chunk)
      })

      audioStream.on("end", () => resolve())

      audioStream.on("error", (err) => reject(err))
    })

    return Buffer.concat(chunks)


  } catch (error) {
    console.error("Edge TTS failed:", error)
    return null
  }
}