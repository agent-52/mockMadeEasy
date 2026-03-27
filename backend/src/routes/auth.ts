import express from 'express';
import { verifyInput } from '../middlewares/zodValidation';
import { checkUserPresent, addUser } from '../db/authQueries';
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import cors from "cors";
import { JWT_SECRET } from '../config/env';
import crypto from "crypto"
import { deleteToken, rotateToken, storeToken, verifyToken } from '../db/refreshTokenQueries';
import { prisma } from '../db/db';

const authRouter = express.Router();

authRouter.use(cookieParser());
authRouter.use(express.json())

const SALT_ROUNDS = 10;

authRouter.post("/signup", verifyInput, async (req, res) =>{
    const {email, password, name} = req.body
    try {
       const userPresent = await checkUserPresent(email)
        if(userPresent){
            return res.status(409).send("User already exists please login")
        }
    } catch (error) {
        return res.json({
            message: error
        })
    }
    const hasedPassword = await bcrypt.hash(password, 10)

    try {
        const addedUser = await addUser(email, hasedPassword, name)
        if(addedUser){
            return res.status(200).json({
                message: "user added succesfuly"
            })
        }
        else{
            return res.status(500).json({
                message: "failed to add user to the db"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
                message: "failed to add user to the db"
        })
    }
    
})


authRouter.post("/login", verifyInput, async(req, res) =>{
    const {email, password} = req.body;
    const userPresent = await checkUserPresent(email);
    if(!userPresent){
        return res.status(401).json({
            message:"email not registered please signup first"
        })
    }else{
        const isPasswordMatching = await bcrypt.compare(password, userPresent.password)
        if(!isPasswordMatching){
            return res.status(401).json({
                message:"incorrect password"
            })
        }
        const token = jwt.sign({id: userPresent.id}, JWT_SECRET, { expiresIn: "45m" })
        const refreshToken = crypto.randomBytes(64).toString("hex")
        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex")

        try {
            const response = await storeToken(hashedToken, userPresent.id)
        } catch (error) {
            console.log("not able to store referesh token in the database: ", error)
            return res.status(500).json({
                message:"refresh token query failed"
            })
        }

        res.cookie("token", token, {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite: "lax"
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        })
        return res.status(200).json({
            message: "user successfuly signed in"
        })
        
    }
    
})


authRouter.get("/refresh", async(req, res) =>{
    
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        return res.status(401).json({
            message:"log in again"
        })
    }
    const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex")
    //pure ko transaction mai wrap kar do 
    try{
    const txResult = await prisma.$transaction(async(tx) =>{
        const result = await verifyToken(tx,hashedToken)
        if(!result){
            //revoke or reject
            
            return "token not found"
        }

        //if found then 
        const userId = result?.userId
        const currentDate = new Date()

        //expired case
        if(result.expiresAt<=currentDate){
            await deleteToken(tx, result.id)
            return "expired token"    
            
        }
        //not expired so rotate it
        const newRefreshToken = crypto.randomBytes(64).toString("hex")
        const newHashedToken = crypto.createHash("sha256").update(newRefreshToken).digest("hex")
        
        await rotateToken(tx, result.id, userId, newHashedToken)

        //isssue new access token and send both refresh and access token 
        const accessToken = jwt.sign({id: userId}, JWT_SECRET, { expiresIn: "45m" })

        return {
            accessToken,
            newRefreshToken
        }

    })

    if(txResult == "token not found"){
        res.clearCookie("refreshToken")
        return res.status(401).json({
            message:"log in again"
        })
    }
    if(txResult == "expired token"){
        res.clearCookie("refreshToken")
        return res.status(401).json({
            message:"refresh token expired login again"
        })
    }

    res.cookie("token", txResult.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    })
    res.cookie("refreshToken", txResult.newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    })

    return res.status(200).json({
        message:"refreshed succesfully"
    })
    }catch(err){
        console.error("Refresh transaction failed:", err)
        return res.status(401).json({ message: "refresh failed" })
    }

    

})

authRouter.post('/logout', async(req, res) =>{
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        return res.status(200).json({
            message:"logged out successfuly"
        })
    }
    const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex")
    try {
       const txResult = await prisma.$transaction(async(tx) =>{
        const result = await verifyToken(tx,hashedToken)
        if(result){
            await deleteToken(tx, result.id)
        }
        
       })
       res.clearCookie("refreshToken",{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    })
       return res.status(200).json({
        message:"logged out successfuly"
       })
    } catch (error) {
        console.log("error on logout route: ",error)
    }
})

export {authRouter}