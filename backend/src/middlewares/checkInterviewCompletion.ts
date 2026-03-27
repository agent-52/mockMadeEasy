import { findInterviewPhase } from "../db/interviewPhaseQuery";

async function checkInterviewCompletion(interviewId:number) {
    const phase = await findInterviewPhase(interviewId)
    if(!phase){
        throw new Error("INTERVIEW_NOT_FOUND")
    }
    if(phase == "completed"){
        return true
    }else{
        return false
    }
}

export {checkInterviewCompletion}