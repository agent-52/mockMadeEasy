import { Prisma } from "@prisma/client"
import { prisma } from "./db"

async function storeToken(tokenHash:string, userId:number) {
    const expiresAt = new Date(Date.now() + 7*24*60*60*1000)
    expiresAt.setDate(expiresAt.getDate()+7)
    const response = await prisma.refreshTokens.create({
        data:{
            tokenHash:tokenHash,
            expiresAt: expiresAt,
            userId
        }
    })
    return response
}


async function verifyToken(tx:Prisma.TransactionClient, token:string) {
    const result = await tx.refreshTokens.findFirst({
        where:{
            
            tokenHash:token
        }
    })
    return result
    
}

async function deleteToken(tx:Prisma.TransactionClient, tokenId:number) {
    await tx.refreshTokens.deleteMany({
        where:{
            id: tokenId
        }
    })
}

async function rotateToken(tx:Prisma.TransactionClient,  tokenId:number, userId:number, newHashedToken:string) {
    await tx.refreshTokens.deleteMany({
        where:{
            id: tokenId
        }
    })
    await tx.refreshTokens.create({
        data:{
            userId,
            tokenHash:newHashedToken,
            expiresAt:new Date(Date.now() + 7*24*60*60*1000)
        }
    })
}
export {storeToken, verifyToken, deleteToken, rotateToken}