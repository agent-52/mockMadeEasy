import type { Request, Response, NextFunction} from 'express';
import { findInterviewDetails } from '../db/interviewDetails';

async function ownershipCheck(req: Request, res: Response, next: NextFunction){
    const interviewId = Number(req.params.interviewId);
    const userId = req.user?.id

    try {
        const interviewDetails = await findInterviewDetails(interviewId)

        if(interviewDetails?.userId !== userId){
            return res.status(403).json({
                message: "not authoraized for this"
            })
        }
        next();
    } catch (error) {
        console.log(error)
        return res.status(403).json({
            message: "not authorized"
        })
    }
}

export {ownershipCheck}