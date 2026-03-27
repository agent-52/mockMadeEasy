import express from 'express';
import { authRouter } from './auth';
import { interviewRouter } from './interview';
import { dashboardRouter } from './dashboard';
import { sessionRouter } from './sessions';
import { setupRouter } from './setup';

const mainRouter = express.Router();

mainRouter.get("/", (req, res) =>{
    res.json({
        message: "hello from the backend "
    })
    
})
mainRouter.use("/auth", authRouter)
mainRouter.use("/interview", interviewRouter)
mainRouter.use("/dashboard", dashboardRouter)
mainRouter.use("/session", sessionRouter)
mainRouter.use("/setup", setupRouter)

export {mainRouter}