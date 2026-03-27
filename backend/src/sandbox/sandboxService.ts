import { Language } from "@prisma/client";
import fs from "fs"
import path, { join } from "path"
import { exec } from "child_process"
import crypto from "crypto"
import util from "util"


async function runSandbox(language:Language, code:string, testCases:any) {
    
    const tempId = crypto.randomUUID()
    const tempDir = path.join(process.cwd(), "sandbox", "temp", tempId)

    //create temp folder
    fs.mkdirSync(tempDir, {recursive:true})

    
    try {
        //save files based on language  and select image based on language
        let imageName = ""
        if(language == "node"){
            fs.writeFileSync(path.join(tempDir, "solution.js"), code)
            imageName = "sandbox-node"
        }else if(language == "python"){
            fs.writeFileSync(path.join(tempDir, "solution.py"),code)
            imageName = "sandbox-python"
        }else if(language == "cpp"){
            fs.writeFileSync(join(tempDir, "solution.cpp"), code)
            imageName = "sandbox-cpp"
        }

        //save testcase.json
        fs.writeFileSync(join(tempDir, "testcases.json"),JSON.stringify(testCases))

        //run docker command
        const dockerCommand = `docker run --rm --memory=100m --cpus=0.5 --network=none -v "${tempDir}:/app" ${imageName}`

        const execAsync = util.promisify(exec)
        const {stdout} = await execAsync(dockerCommand)

        //parse stdout json
        const parsed = JSON.parse(stdout)

        return {
            passedCount: parsed.passedCount,
            failedCount: parsed.failedCount,
            totalCount: parsed.totalCount,
            passed: parsed.passed,
            runtimeMs: parsed.runTimeMs,
            error: parsed.error
        }
        
    } catch (error) {
        return {
            passedCount: 0,
            failedCount: 0,
            totalCount:0,
            passed: false,
            runtimeMs: 0,
            error:error
        }
    }finally{
        //delete temp folder
        fs.rmSync(tempDir, {recursive:true, force: true})
    }

}

export {runSandbox}