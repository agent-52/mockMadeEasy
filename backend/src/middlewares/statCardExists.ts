import { NextFunction, Request, Response } from "express"
import { getInterviewStatCard } from "../db/statCardQueries"

async function statCardExists(req:Request, res:Response, next:NextFunction) {
    const interviewId = Number(req.params.interviewId)
    try {
        const interview = await getInterviewStatCard(interviewId)
        if (!interview) {
            return res.status(404).json({ message: "interview not found" })
        }
        if(interview?.endedAt == null){
            return res.status(409).json({
                message:"interview not completed yet cant fetch stats"
            })
        }
        if(!interview.statsCards){
            return res.status(400).json({
                message:"stat card not available for this interview "
            })
        }
        res.locals.statsCardId = interview.statsCards.id;
        next()
    } catch (error) {
        console.log("statCardExists check failed with error: ",error)
        return res.status(500).json({
            message: "stat card existence check failed"
        })
    }
}

export {statCardExists}