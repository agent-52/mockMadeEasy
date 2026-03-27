import WebSocket from "ws"
import type { WebSocket as WebSocketType } from "ws"
import { Server } from "http" 
import { DEEPGRAM_KEY } from "../../config/env"
import { createClient } from "@deepgram/sdk"



export function setupWebSocket(server:Server){
    const wss = new WebSocket.Server({server})
    wss.on("connection", (clientSocket: WebSocketType) =>{
        console.log("Client connected")
        // console.log("DEEPGRAM_KEY:", DEEPGRAM_KEY);


        //deepgram websocket connection
        
        const deepgramSocket = new WebSocket(
            "wss://api.deepgram.com/v1/listen?model=nova-2&encoding=linear16&sample_rate=48000&channels=1&interim_results=true&punctuate=true&language=en",
            {
                headers:{
                    Authorization: `Token ${DEEPGRAM_KEY}`
                }
            }
        )

        let deepgramOpen = false
        //deepgram listners

        deepgramSocket.on("open", () => {
            console.log("Deepgram raw connected");
            deepgramOpen = true
        });

        deepgramSocket.on("metadata", (data) => {
            console.log("Metadata:", data)
        })


        deepgramSocket.on("message", (data:any) =>{
            
            const parsed = JSON.parse(data)
            console.log(parsed.channel?.alternatives?.length)
            if(parsed.channel?.alternatives?.length){
                // console.log("inside if statement")
                const transcript = parsed.channel.alternatives[0].transcript
                
                //filter out the empty transcripts
                if(transcript.trim().length === 0) return
                console.log(transcript)
                clientSocket.send(JSON.stringify({
                    type: "transcript",
                    transcript,
                    isFinal: parsed.is_final
                }))
                console.log("message came from deepgram")
            }
        })

        deepgramSocket.on("close", (code, reason) => {
            console.log("❌ Deepgram RAW closed:", code, reason.toString());

            if (clientSocket.readyState === 1) {
                clientSocket.send(JSON.stringify({
                type: "error",
                message: "Speech service disconnected"
            }));
        }
        });

        deepgramSocket.on("warning", (w) => {
            console.log("Warning:", w)
        })


        deepgramSocket.on("error", (err) => {
            console.log("Full error object:", JSON.stringify(err, null, 2));
        });


        clientSocket.on("message", (message) => {
            if (Buffer.isBuffer(message) && deepgramSocket.readyState === WebSocket.OPEN) {

                const arrayBuffer = new ArrayBuffer(message.byteLength);
                new Uint8Array(arrayBuffer).set(message);
                deepgramSocket.send(arrayBuffer);
            }                
            
        })
        
        clientSocket.on("close", () =>{
            if (deepgramSocket.readyState===WebSocket.OPEN) {
                deepgramSocket.send(JSON.stringify({ type: "CloseStream" }));
                deepgramSocket.close();
            }
            console.log("Deepgram disconnected")
            console.log("Client disconnected")
        })
    
    })
}
