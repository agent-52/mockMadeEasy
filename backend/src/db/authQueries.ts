import { prisma } from "./db";

async function checkUserPresent(email:string){
    try {
        const userPresent = await prisma.user.findFirst({where: {email}})
        if(userPresent){
            return userPresent;
        }else{
            return false;
        }
    } catch (error) {
        console.log("checkAlreadyuse failed: ", error)
        return;
    }
}

async function addUser(email: string, password: string, name: string){
    try{
        const user = await prisma.user.create({
            data:{
                email, 
                password,
                name
            }
        })
        return user;
    }catch(error){
        console.log("add user failed", error)
        return null;
    }
}

export {checkUserPresent, addUser}