import { Prisma } from "@prisma/client";

async function createCodeExecutionPlaceholder(tx:Prisma.TransactionClient, statsCardDetailId:number) {
    
    
    await tx.codeExecutionResult.upsert({
        where:{statsCardDetailId},
        update:{},
        create:{
            statsCardDetailId,
            passed:false,
            error:"Not evaluated yet"
        }
    })
    
    
}

export {createCodeExecutionPlaceholder}