import express from "express"
import { mainRouter } from "./routes/main"
import cookieParser from "cookie-parser"
import http from "http"
import "./websocket/transcript/speechServer"
import { setupWebSocket } from "./websocket/transcript/speechServer"
import { evaluateQuestionServiec_ai } from "./services/ai/evaluateQuestionService"
import { Difficulty } from "@prisma/client"
import { evaluateInterviewService_ai} from './services/ai/evaluateInterviewService_ai';
import cors from 'cors';

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}))
app.use("/api", mainRouter)

const server = http.createServer(app)

setupWebSocket(server)

server.listen(3000, () =>{
    console.log("app listning on port 3000")
})

export {server}