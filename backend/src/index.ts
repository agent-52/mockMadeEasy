import express from "express"
import { mainRouter } from "./routes/main"
import cookieParser from "cookie-parser"
import http from "http"
import "./websocket/transcript/speechServer"
import { setupWebSocket } from "./websocket/transcript/speechServer"
import cors from 'cors';
import passport from "../src/config/passport"

const app = express()
app.use(cors({
    credentials: true,
    origin: [
        "http://localhost:5173",
        "https://mock-made-easy.vercel.app"
    ]
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api", mainRouter)

const server = http.createServer(app)

setupWebSocket(server)

server.listen(3000, () =>{
    console.log("app listning on port 3000")
})

export {server}