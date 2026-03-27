const zod = require("zod")
import type { Request, Response, NextFunction } from "express";
const credentialSchema = zod.object({
    email: zod.email(),
    password: zod.string()
})

function verifyInput(req:Request, res:Response, next:NextFunction){
    try {
        const response = credentialSchema.safeParse({email: req.body.email, password: req.body.password});
        if(response.success){
            next()
        }else{
            res.status(411).send("your inputs were wrong")
        }
    } catch (error) {
       res.json({
        message:"zod validation funciton failed",
        error
       }) 
    }
    
}

export {verifyInput}