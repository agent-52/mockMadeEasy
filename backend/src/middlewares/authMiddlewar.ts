import type { Request, Response, NextFunction } from "express"
import { JWT_SECRET } from "../config/env"
import type { JwtPayload } from "jsonwebtoken"
import jwt from "jsonwebtoken"
function auth (req:Request, res:Response, next:NextFunction){
    try {
        const token = req.cookies?.token
        
        if(!token){
            return res.status(401).json({
                message: "Authentication required",
            })
        }
        const decoded = jwt.verify(token, JWT_SECRET)

        if( typeof decoded !== "object" || !("id" in decoded)){
            return res.status(401).json({
                message: "invalid token"
            })
        }

        req.user = {id: decoded.id as number}
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        })
    }
    
}

export {auth}