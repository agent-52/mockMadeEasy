import express, { response } from "express";
import { auth } from "../middlewares/authMiddlewar";
import { createInterviewRecord } from "../db/interviewCreation";
import { findInterviewDetails, findInterviewReviewDetails } from "../db/interviewDetails";
import { findAvailableQuestions, findFirstUnansweredQuestion, findInterviewQuestions, findInterviewQuestionsByPhase, findNextInterviewQuesiton, findTotalQuestionsbyPhase } from "../db/interviewQuestions";
import { ownershipCheck } from "../middlewares/ownershipCheck";
import { createUserResponse } from "../db/userResponse";
import { countAnsweredQuestions, countTotalQuestions, findNextQuestionOrder } from "../db/interviewProgress";
import { questionInterviewRelationCheck } from "../middlewares/questionInterviewRelationCheck";
import { markInterviewComplete } from "../db/markInterviewComplete";
import { alreadyHaveStatCard, createStatCard, getInterviewStatCard, updateAccuracy, updateTotalAttempted, updateTotalCorrect } from "../db/statCardQueries";
import { prisma } from "../db/db";
import { createStatCardDetail, findStatsCardDetailId } from "../db/statCardDetailQueries";
import { error } from "node:console";
import { statCardExists } from "../middlewares/statCardExists";
import { evaluateCodingResponse, evaluateResponse } from "../db/responseEvaluation";
import { createCodeExecutionPlaceholder } from "../db/placeHolderCreationQuery";
import { followUpsToThisInterview } from "../db/followUpQuestionsQuery";
import { findInterviewPhase, findInterviewPhaseT, updateInterviewPhaseTo, updateLastPhaseTo } from "../db/interviewPhaseQuery";
import { checkIfAllFollowUpAnswered } from "../middlewares/checkIfAllFollowUpAnswered";
import { findInterviewQuestionId } from "../db/interviewQuestionQueries";
import { checkInterviewCompletion } from "../middlewares/checkInterviewCompletion";
import { findCodingQuestions, findCodingStatus } from "../db/codingQuesionQueries";
import { checkIsSkipped } from "../middlewares/checkIsSkipped";
import { checkSubjectTopicRelation } from "../middlewares/checkSubjectTopicRelation";
import { Difficulty, InterviewPhase, InterviewRole, SubjectType } from "@prisma/client";
import { findInterviewSummaryBase, updateInterviewSummary } from "../db/interviewSummary";
import crypto from "crypto"
import { findAudioLink } from "../db/ttsQueries";
import { EvaluateInterviewInput, evaluateInterviewService_ai} from "../services/ai/evaluateInterviewService_ai";
import { getAllTestCases } from "../db/testCasesQueries/getTestCases";
import fs from 'fs';
import { mkdtemp, writeFile } from "node:fs";
import { join } from "node:path";
import { runSandbox } from "../sandbox/sandboxService";
import { language } from "@elevenlabs/elevenlabs-js/api/resources/dubbing/resources/resource";
import { generateTransition } from "../services/interviewer/transitionEngine";
import { getOrCreateAudio } from "../services/tts/ttsService";
import { selectQuestions } from "../services/interview/quesitonSelector";
import { calculateImporvementFromLastSession} from "../middlewares/calculateImprovementFromLastSession";
import { messages } from "@elevenlabs/elevenlabs-js/api/resources/conversationalAi/resources/conversations";

export type SandBoxResponse ={
    passedCount: number,
    failedCount:number,
    totalCount:number,
    passed: boolean,
    runtimeMs: number,
    error: string|null
}

const interviewRouter = express.Router()

interviewRouter.post("/preview", auth, async(req, res) =>{
    type RequestType = {
        roleType:InterviewRole,
        subjects: SubjectType[],
        difficulty:Difficulty,
        topicIds?:number[],
        includeIntro:boolean,
        questionCount:number
    }

    const reqBody:RequestType = req.body;

    const difficulty = reqBody.difficulty
    const subjects = reqBody.subjects
    const topicIds = reqBody.topicIds
    const roleType = reqBody.roleType
    const includeIntro = reqBody.includeIntro
    const questionCount = reqBody.questionCount

    if(!reqBody.subjects || reqBody.subjects.length == 0 || !reqBody.difficulty || reqBody.questionCount <= 0){
        return res.status(400).json({
            message:"invalid inputs"
        })
    }

    //difficulty validation check
    if(!Object.values(Difficulty).includes(difficulty)){
        return res.status(400).json({ message: "Invalid difficulty" })
    }
    //topic-subject relation check
    if(topicIds){
        const topicSubjectRelationValid = await checkSubjectTopicRelation(subjects, topicIds)

        if(!topicSubjectRelationValid){
            return res.status(409).json({
                message:"some selected topics does not match the subjects"
            })
        }
    }
    
    //availabe quesion logic 
    const availabelQuestions = await findAvailableQuestions(difficulty, subjects, topicIds)
    if(availabelQuestions.length < questionCount){
        return res.status(409).json({
            message:"Not enough quesions"
        })
    }

    //quesiton selction and seed sufffling
    const seed = crypto.randomUUID()
    const selectedQuestions = selectQuestions({availabelQuestions, subjects, questionCount, seed})

    // subject and topic distribution
    let subjectCountMap:Record<string, number> = {} 
    let topicCountMap:Record<number,number> = {}

    availabelQuestions.forEach((quesion) =>{
        const countedSubjects = new Set<string>()
        quesion.topics.forEach((t) =>{

            const topic = t.topic
            const subjectName = t.topic.subject.title

            //subject distribution
            if(subjects.includes(subjectName as SubjectType) && !countedSubjects.has(subjectName)){
                subjectCountMap[subjectName] = (subjectCountMap[subjectName] || 0)+1;
                countedSubjects.add(subjectName)
            }

            //topic distribution
            if(!topicIds || topicIds.includes(topic.id)){
                topicCountMap[topic.id] = (topicCountMap[topic.id] || 0) +1;
            }
        })
    })

    const subjectDistribution = Object.entries(subjectCountMap).map(([subject, count]) => ({subject, availableCount: count}))

    const topicDistribution = Object.entries(topicCountMap).map(
        ([topicId, count]) => ({
        topicId: Number(topicId),
        availableCount: count
        })
    )

    //estimate duraiton logic
    let codingQuestionCount = 0;
    let theoryQuestionCount = 0;
    let theoryAvgTime = 2;
    let codingAvgTime = 7;

    codingQuestionCount =selectedQuestions.filter(q => q.type === "coding").length
    theoryQuestionCount = selectedQuestions.length-codingQuestionCount

    const estimatedDurationMinutes = (theoryAvgTime*theoryQuestionCount)+(codingAvgTime*codingQuestionCount)

    return res.status(200).json({
        isValid: true,
        totalAvailableQuestions: availabelQuestions.length,
        requestedQuestionCount: questionCount,
        estimatedDurationMinutes,
        distribution: {
            subjects: subjectDistribution,
            topics: topicDistribution
        },
        theoryQuestionCount,
        codingQuestionCount,
        includeIntro,
        seed,
        planRestriction: null
    })



})

interviewRouter.post("/", auth, async(req, res) =>{
    const userId = req.user?.id;
    if(!userId){
        return res.json({
            message: "user id not found first login please"
        })
    }
    const {roleType, subjects, difficulty, topicIds, includeIntro, questionCount, seed} = req.body;

    //validate subject array not empty
    if(subjects.length == 0){
        return res.status(400).json({
            message:"subject array is empty"
        })
    }
    //topic subject relation check
    const isSubTopicRelaitonValid = await checkSubjectTopicRelation(subjects, topicIds)
    if(!isSubTopicRelaitonValid){
        return res.status(409).json({
            message:"selected topics are not related to selected subjectes"
        })
    }

    try {
        const availabelQuestions = await findAvailableQuestions(difficulty, subjects, topicIds)
        const selectedQuesitons = selectQuestions({
            availabelQuestions, subjects, questionCount, seed
        })
        console.dir(selectedQuesitons, {depth:null})
        const interview = await createInterviewRecord(userId, difficulty, roleType, subjects, selectedQuesitons)
        
        return res.status(200).json({
            interviewId: interview.id,
            phase: interview.phase,
            staus: interview.status
        })
    } catch (error) {
        console.log("interviewCreation failed", error)
        return res.status(500).send(error)
    }
})

interviewRouter.get("/:interviewId", auth, ownershipCheck, async (req, res) =>{

    const interviewId = Number(req.params.interviewId);
    
    const interviewDetails = await findInterviewDetails(interviewId);
    if(interviewDetails == null){
        return res.json({
            message:"interview details not found"
        })
    }
    
    return res.status(200).json({
        sessionMeta:{
            roleType:interviewDetails.roleType,
            difficulty:interviewDetails.difficulty,
            includeIntro:interviewDetails.includeIntro,
            phase:interviewDetails.phase,
            status:interviewDetails.status,
            estimatedDuration:interviewDetails.estimatedDuration
        },
        questions:await Promise.all(interviewDetails.questions.map(async (q) => {
            
            
            return (
                {
                    interviewQuestionId:q.id,
                    order:q.order,
                    questionId:q.question.id,
                    type:q.question.type,
                    difficulty:q.question.difficulty,
                    topic:q.question.topics.map((questionTopic) => questionTopic.topic.name),
                    title:q.question.title,
                    expectedTime:120,// for mvp 
                    constraints:q.question.constraints,
                    starterCode:q.question.starterCode,
                }
            )
        }))
    })
    
    
})

interviewRouter.get("/:interviewId/question", auth, ownershipCheck, async(req,res) =>{
    const interviewId = Number(req.params.interviewId);

    try {
        const phase = await findInterviewPhase(interviewId)
        if(!phase){
            throw new Error("PHASE_FETCH_FAILED")
        }
        const firstQuestion = await findFirstUnansweredQuestion(interviewId,phase)
        let firstQuestionAudioUrl = null
        
        if (!firstQuestion) {
            return res.status(200).json({
                completed: true
            })
        }
        if(firstQuestion != null){
            try {
                firstQuestionAudioUrl = await getOrCreateAudio(firstQuestion.question.title)
                
            } catch (err) {
                console.error("TTS failed for question:", err)
                firstQuestionAudioUrl = null
            }
        }
        let transitionText = null
        let transitionAudioUrl = null
      
        if(phase == "base"){
            transitionText = generateTransition("interviewStart")  
            
        }
        if(phase == "followup"){
            transitionText = generateTransition("followup")  
        }
       
        if(transitionText){
            try {
                transitionAudioUrl = await getOrCreateAudio(transitionText)
            } catch (err) {
                console.error("TTS failed for transition:", err)
                transitionAudioUrl = null
            }
        }
        console.log("transitionAudioUrl :- ",transitionAudioUrl)
        const totalQuestions = await findTotalQuestionsbyPhase(prisma, interviewId, phase)
        return res.status(200).json({
            firstQuestion:{interviewQuestionId:firstQuestion?.id, ...firstQuestion?.question},
            firstQuestionAudioUrl,
            transition:{
                text:transitionText,
                audioUrl:transitionAudioUrl
            },
            totalQuestions,
            phase
        })

    } catch (error) {
        console.log("cant fetch interview questions"+error)
        return res.status(400).json({
            messages:"there was an error on /quesiton route",
            error: error
        })
    }


})

interviewRouter.post("/:interviewId/answer",auth, ownershipCheck,questionInterviewRelationCheck, async (req, res) =>{
    const {interviewQuestionId, response, timeTaken, skipped, language} = req.body
    const interviewId = Number(req.params.interviewId)
    const userId = req.user?.id

    //guards
    if(!userId){
        return res.status(411).json({
            message:"please login first"
        })
    }
    
    if(interviewQuestionId == null){
        return res.status(403).json({
            message:"interview question relation not found (interviewQuestionId does not exists)"
        })
    }
    const isSkipped = await checkIsSkipped(interviewQuestionId)
    if (isSkipped === null) {
        return res.status(404).json({ message: "interview question not found" })
    }

    if(isSkipped == true){
        return res.status(409).json({
            message:"cant answer skipped questions"
        })
    }

    try {
        const txResult = await prisma.$transaction(async (tx) =>{

            if(skipped == true){
                await tx.interviewQuestion.update({
                    where:{
                        id:interviewQuestionId
                    },
                    data:{
                        skipped:true
                    }
                })  
            }else{
                const result = await createUserResponse(tx, interviewQuestionId, response, interviewId, language)
                await tx.interviewQuestion.update({
                    where: { id: interviewQuestionId },
                    data: {
                        timeTaken
                    }
                })
                if(result == "already asnwered"){
                    // return res.status(409).json({
                    //     message: "question alredy answered"
                    // })
                    throw new Error("AlREADY_ANSWERED")
                }
                if(result == "Interview completed"){
                    // return res.status(422).json({
                    //     message : "interview already completed"
                    // })
                    throw new Error("INTERVIEW_COMPLETED")
                }
            }

            const answeredQuestions = await countAnsweredQuestions(tx, interviewId)
            const nextQuestionOrder = await findNextQuestionOrder(tx, interviewId)

            let interviewCompleted = false

            if(nextQuestionOrder == null){
                await markInterviewComplete(tx, interviewId)

                const statCardPresent = await alreadyHaveStatCard(tx, interviewId)

                if(!statCardPresent){
                    const statCard = await createStatCard(tx, interviewId, userId, answeredQuestions, 0)
                    
                    const statCardDetails = await createStatCardDetail(tx,interviewId, statCard.id)
                }
                

                interviewCompleted = true
                
            }
            let nextQuestion = null
            if(nextQuestionOrder != null){
                nextQuestion = await findNextInterviewQuesiton(tx, interviewId, nextQuestionOrder)
            }
            const phase = await findInterviewPhaseT(tx, interviewId)
            let totalQuestions
            if(phase){
                totalQuestions = await findTotalQuestionsbyPhase(tx, interviewId, phase)
            }

            
            return {
                
                answeredQuestions,
                nextQuestionOrder,
                nextQuestion:{interviewQuestionId:nextQuestion?.id, ...nextQuestion?.question},
                interviewCompleted,
                totalQuestions,
                phase
            }
        })

        const transitionText = generateTransition("movingNext")
        
        const [transitionAudioUrl,  nextQuestionAudioUrl] = await Promise.all([
            getOrCreateAudio(transitionText),
            txResult.nextQuestion.title
             ?getOrCreateAudio(txResult.nextQuestion.title)
             :Promise.resolve(null)
        ])

        return res.status(200).json({...txResult, transition:{text:transitionText, audioUrl:transitionAudioUrl},nextQuestionAudioUrl})
        
    } catch (error:any) {
        if(error.message == "AlREADY_ANSWERED"){
            return res.status(409).json({ message: "question already answered" })
        }
        if (error.message === "INTERVIEW_COMPLETED") {
        return res.status(422).json({ message: "interview already completed" })
        }

        console.error("answer route failed:", error)
        return res.status(500).json({
            message: "user response was not recorded"
        })
    }



})

interviewRouter.get("/:interviewId/progress",auth, ownershipCheck, async (req, res) =>{
    const interviewId = Number(req.params.interviewId)
    const isCompleted = await checkInterviewCompletion(interviewId)
    if(isCompleted){
        return res.status(409).json({
            message:"interview completed no further progress"
        })
    }
    try {
        
        const txResult = await prisma.$transaction(async(tx) =>{
            const totalQuestions = await countTotalQuestions(tx,interviewId);
            const totalAnsweredQuestions = await countAnsweredQuestions(tx,interviewId)
            const nextQuestionOrder = await findNextQuestionOrder(tx,interviewId)
            return {
                totalQuestions,
                totalAnsweredQuestions,
                nextQuestionOrder
            }
        })

        return res.status(200).json(txResult)
    } catch (error) {
        console.log("progress route failed: ",error)
        return res.status(500).json({
            message: "not able to fetch interview progress"
        })
    }

})

interviewRouter.get("/:interviewId/status", auth, ownershipCheck,statCardExists, async(req,res) =>{

    const interviewId= Number(req.params.interviewId)
    const statsCardId = res.locals.statsCardId

    const phase = await findInterviewPhase(interviewId)
    const codingQuestionsStatus = await findCodingStatus(interviewId,statsCardId )
    const allFollowUpAnswered = await checkIfAllFollowUpAnswered(interviewId)
    let canSkipFollowup
    if((phase === "followup" && !allFollowUpAnswered)){
        canSkipFollowup = true;
    }else{
        canSkipFollowup = false
    }
    return res.status(200).json({
        "phase": phase,
        "canSkipFollowup": canSkipFollowup,
        "canEvaluateCode": codingQuestionsStatus.canEvaluateCode,
        "codingEvaluated":  codingQuestionsStatus.codingEvaluated
    })
})

interviewRouter.get("/:interviewId/review", auth, ownershipCheck,statCardExists, async (req, res) =>{
    const interviewId = Number(req.params.interviewId)
    const statsCardId = res.locals.statsCardId
    try {
        const result = await findInterviewReviewDetails(interviewId, statsCardId)
        if(result.length == 0){
            return res.json({
                message:"no questions in the interview for review"
            })
        }
        if(result[0]?.interview.endedAt == null){
            return res.status(409).json({
                message:"interview not completed yet"
            })
        }

        res.status(200).json({
            "questions": result.map((q) => (
                {
                    "interviewQuestionId":q.id,
                    "skipped":q.skipped,
                    "order": q.order,
                    "id": q.questionId,
                    "title": q.question.title,
                    "type":q.question.type,
                    "timeTaken":q.timeTaken,
                    "topics":q.question.topics.map((topic) => topic.topic.name),
                    "description": q.question.description,
                    "difficulty": q.question.difficulty,
                    "userAnswer": (q.response?.response == null)?null:{
                        "response": q.response.response || null,
                        "attemptedAt": q.response.attemptedAt
                    },
                    "idealAnswer": null,
                    "gapAnalysis":null,
                    "aiEvaluation":null,
                    "score":null,
                    "isCorrect":q.question.statsCardDetails[0]?.isCorrect,
                    "passed":q.question.statsCardDetails[0]?.codeExecutionResult?.passed,
                    "error":q.question.statsCardDetails[0]?.codeExecutionResult?.error
                }
            ))
        })
    } catch (error) {
        console.log("interview review route had eroor:- "+error)
    }

})

interviewRouter.get("/:interviewId/stats",auth, ownershipCheck, async(req, res) =>{
    const interviewId = Number(req.params.interviewId)
    const userId = Number(req.user?.id)
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
        
        const statcard = interview.statsCards

        
        const skippedCount = interview.statsCards.details.filter(
            d => d.isCorrect === null
        ).length

        const codingPassedArray = statcard.details.map((q) => (q.codeExecutionResult?.passed))
        const codingPassedCount = codingPassedArray.reduce((count, currentValue) =>{
            if(currentValue == true){
                return count+1
            }else{
                return count
            }
        },0)
        const imporvementFromLastSession = await calculateImporvementFromLastSession(userId, interviewId)
        return res.status(200).json({
            "interviewId": interview.id,
            "totalQuestions": statcard.details.length,
            "attempted": statcard.totalAttempted,
            "correct": statcard.totalCorrect,
            "skipped":skippedCount ,
            "codingPassed": codingPassedCount,
            "details": statcard.details,
            "accuracy":statcard.totalAttempted>0?(statcard.totalCorrect/statcard.totalAttempted)*100:0,
            "incorrect":statcard.totalAttempted-statcard.totalCorrect,
            "improvementFromLastSession":imporvementFromLastSession,
            "topicBreakdown":null,
            "avgTime":null
            
        })
    } catch (error) {
        console.log("stats route failed: ",error)
        return res.status(500).json({
            message:"not able to fetch stats for this interview"
        })
    }
})

interviewRouter.post("/:interviewId/evaluate",auth,ownershipCheck,statCardExists, async(req, res) =>{
    const interviewId = Number(req.params.interviewId)
    const statsCardId = res.locals.statsCardId

    //evaluation should be blocked per phase not per interview means one phase cant call this route twice but if phase are different it can be called in the same interview again
    const interview = await prisma.interview.findUnique({
        where:{
            id: interviewId
        }
    })
    if(!interview){
        return res.status(403).json({
            message:"interview not found"
        })
    }
    if(interview?.lastEvaluatedPhase == interview?.phase){
        return res.status(409).json({
            message:"Interview already evaluated"
        })
    }
    if(interview.phase === "completed"){
        return res.status(409).json({
            message:"interview is completed already"
        })
    }
    //

    const interviewQuestions = await findInterviewQuestionsByPhase(interviewId, interview.phase)

    if(interview.phase == "followup"){
        const ready = await checkIfAllFollowUpAnswered(interviewId)
        if (!ready) {
            return res.status(409).json({
            message: "All follow-up questions must be answered before evaluation"
        })
  }
    }
    //
    let followupInjected = false
    const previousPhase = interview.phase
    let nextPhase: InterviewPhase = previousPhase

    const txResult = await prisma.$transaction(async (tx) =>{
        const interviewQuestionIds = interviewQuestions.map((q) => ({interviewQuestionId:q.id, type:q.question.type, questionId:q.question.id, questionText:q.question.title, difficulty:q.question.difficulty, timeTaken:q.timeTaken, averageTime:q.question.averageTime}))
        for (const question of interviewQuestionIds) {
            if(question.type == "theory"){
                await evaluateResponse(tx, question.interviewQuestionId,question.questionId, statsCardId, question.questionText, question.difficulty, question.timeTaken, question.averageTime)
            }
            if(question.type == "coding"){
                const statsCardDetailId = await findStatsCardDetailId(tx, statsCardId, question.questionId)
                if(!statsCardDetailId){
                    throw new Error("statCardDetailId not found")
                }
                await createCodeExecutionPlaceholder(tx, statsCardDetailId)
                
            }
        }
        //statcard updations
        const totalCorrect = await updateTotalCorrect(tx , statsCardId)
        const totalAttempted = await updateTotalAttempted(tx, interviewId, statsCardId)
        const accuracy = (totalCorrect/totalAttempted)*100;
        await updateAccuracy(tx, statsCardId, accuracy)

        await updateLastPhaseTo(tx, interview.phase, interviewId)

        //changin interview phase to follow up if followups exists

        if(interview.phase === "base"){
            const followUps = await  followUpsToThisInterview(tx,interviewId, statsCardId)

            if(followUps.length>0){
                //inject followup logic
            
                //interviewQuestonmapping
                
                const totalQuestionInBaseRound = await countTotalQuestions(tx, interviewId)

                const followUpQuestionMappingWithInterview = followUps.map((q, index) => ({questionId:q.id, interviewId, order:totalQuestionInBaseRound+index+1}))

                await tx.interviewQuestion.createMany({
                    data: followUpQuestionMappingWithInterview
                })

                //create statcardDetail rows for these questoins 

                const statCardDetailMapping = followUps.map((q) => ({statsCardId, questionId:q.id}))

                await tx.statsCardDetail.createMany({
                    data:statCardDetailMapping
                })

                await updateInterviewPhaseTo(tx, "followup", interviewId)
                nextPhase = "followup"
                followupInjected = true
            }else{
                await updateInterviewPhaseTo(tx, "completed", interviewId)
                await tx.interview.update({
                    where:{
                        id:interviewId
                    },
                    data:{
                        status:"completed"
                    }
                })
                nextPhase = "completed"
            }

            
        }

        if(interview.phase === "followup"){
            await updateInterviewPhaseTo(tx, "completed", interviewId)
            await tx.interview.update({
                where:{
                    id:interviewId
                },
                data:{
                    status:"completed"
                }
            })
            nextPhase = "completed"
        }

        return{
            interviewId,
            previousPhase:previousPhase,
            nextPhase:nextPhase,
            followupInjected
        }

        
    })
    return res.status(200).json(txResult)

    
    

})

interviewRouter.post("/:interviewId/evaluate-code",auth,ownershipCheck,statCardExists, async (req, res) =>{
    const interviewId = Number(req.params.interviewId)
    const statsCardId = res.locals.statsCardId
    //guards
        //interviw exists
    const interview = await findInterviewDetails(interviewId)
    if(interview == null){
        return res.status(409).json({
            message:"interview does not exists"
        })
    }

        //evaluation not allowed in base or followup phase only in completed phase
    if(interview.phase != "completed"){
        return res.status(409).json({
            message:"coding evaluation not allowed in phases other than completed"
        })
    }
        //coding question are there in this interview
    const codingQuestions = await findCodingQuestions(interviewId, statsCardId)
    if(codingQuestions.length == 0){
        return res.status(200).json({
            codingEvaluated: false,
            reason:"no coding question in this interview"
        })
    }

    //evaluation logic v1

        //for making this route idempotent (means retry safe) we will skip any question whose error !== "Not evaluated yet" 
    let codingEvaluated = false
    try {
        const txResult = await prisma.$transaction(async (tx) =>{

            // Guard check for : all place holders are not already been resloved
            const pending = await tx.statsCardDetail.findFirst({
                where: {
                    statsCardId,
                    question: { type: "coding" },
                    codeExecutionResult: {
                        error: "Not evaluated yet"
                    }
                }
            })

            if (!pending) {
                throw new Error("NO_PENDING_EVALUATION")
            }
        
            for(const question of codingQuestions){
                
                const statsCardDetail = question.question.statsCardDetails[0]
                //ensureing that there is only on statcard detail unique to a statcardid and quesitonid
                if (question.question.statsCardDetails.length !== 1) {
                    throw new Error("INVALID_STATS_CARD_DETAIL_STATE")
                }

                if(!statsCardDetail){
                    throw new Error("STAT_CARD_DETAIL_NOT_FOUND")
                }

                if(question.question.statsCardDetails[0]?.codeExecutionResult?.error === "Not evaluated yet"){

                    //
                        //getting results from sandbox
                    //

                        //fetching all testCases and making a json file of them
                    const testCases = await getAllTestCases(tx, question.questionId)

                    const testCasesJson:Record<number, {input:string, expectedOutput:string}> = {}

                    testCases.forEach((t, i) => testCasesJson[i] = {input:t.input, expectedOutput:t.expectedOutput})

                        // fetching users code
                    const userResponse = await tx.userResponse.findUnique({
                        where:{
                            interviewQuestionId:question.id
                        },
                        select:{
                            response:true,
                            language:true
                        }
                    })

                    if(!userResponse || userResponse.language == null || userResponse.response == null){
                        throw new Error("user response not found")
                    }
                    const userCode = userResponse?.response
                    const userLanguage = userResponse.language

                    // runSandbox(language, code, testCases)
                    const sandBoxResponse:SandBoxResponse = await runSandbox(userLanguage, userCode, testCasesJson)
                    

                    await tx.codeExecutionResult.update({
                        where:{
                            statsCardDetailId:statsCardDetail.id
                        },
                        data:sandBoxResponse
                    })

                    await evaluateCodingResponse(tx, question.id, statsCardDetail.id, question.question.title, question.question.difficulty, question.timeTaken, question.question.averageTime)
                }
                
            }
            await updateTotalCorrect(tx, statsCardId)
            await updateTotalAttempted(tx, interviewId, statsCardId)
            const updatedResult = await tx.statsCardDetail.findMany({
                where:{
                    statsCardId,
                    question:{
                        type:"coding"
                    }
                },
                select:{
                    questionId:true,
                    codeExecutionResult:true,
                    
                }
            })
            codingEvaluated = true
            const results = []
            for (const r of updatedResult) {
                const interviewQuestionId = await findInterviewQuestionId(interviewId, r.questionId)
                results.push({
                    questionId: r.questionId,
                    interviewQuestionId,
                    passed: r.codeExecutionResult?.passed,
                    error: r.codeExecutionResult?.error,
                    runtimeMs: r.codeExecutionResult?.runtimeMs
                })
            }
            return {
                interviewId,
                codingEvaluated,
                results:results
            }
        })
        return res.status(200).json(txResult)
    } catch (error:any) {
        if(error.message === "NO_PENDING_EVALUATION"){
            return res.status(409).json({
                message:"no coding questions pending for evaluation"
            })
        }
        if(error.message === "STAT_CARD_DETAIL_NOT_FOUND"){
            return res.status(409).json({
                message:"no stat card detail exists for one of the questions "
            })
        }
        
    }


    

})

interviewRouter.post("/:interviewId/skip-followup", auth, ownershipCheck,statCardExists, async(req, res) =>{
    const interviewId = Number(req.params.interviewId)
    const statsCardId = res.locals.statsCardId
    const interview = await findInterviewDetails(interviewId)
    if(interview == null){
        return res.status(400).json({
            message:"interview does not exist"
        })
    }
    if(interview.phase !== "followup"){
        return res.status(409).json({
            message:"not in follow up phase so cant skip"
        })
    }
    if (interview.status === "completed") return res.status(409).json({
        message:"interview in completed phase cant skip followups now"
    })
    const txResult = await prisma.$transaction(async(tx) => {
        const skippedCount = await tx.interviewQuestion.updateMany({
            where: {
                interviewId,
                question: {
                followUpToQuesitonId: { not: null }
                },
                response: null
            },
            data: {
                skipped: true
            }
        })
        await tx.interview.update({
            where: { id: interviewId },
            data: {
                phase: "completed",
                status:"completed"
            }
        })
        await updateTotalAttempted(tx, interviewId, statsCardId)
        await updateTotalCorrect(tx, statsCardId)

        return{
            interviewId,
            previousPhase:"followup",
            nextPhase:"completed",
            skippedCount:skippedCount.count
        } 

    })
    return res.status(200).json(txResult)
})

interviewRouter.get("/:interviewId/summary",auth, ownershipCheck, statCardExists, async(req,res) =>{
    const interviewId = Number(req.params.interviewId)
    const userId = Number(req.user?.id)
    try {
        const summaryResult = await findInterviewSummaryBase(interviewId)
        if(summaryResult == null){
            return res.status(409).json({
                message:"interview details does not exist for this interview"
            })
        }
        if(!summaryResult.statsCards){
            return res.status(403).json({
                message:"stat card for this interview does not exists"
            })
        }

        //if coding question exist and not evaluated return 
        summaryResult.questions.forEach((q) =>{
            if(q.question.type == "coding"){
                const questionDetails = summaryResult.statsCards?.details.filter(d => d.questionId === q.questionId)
                if(!questionDetails || !questionDetails[0]?.codeExecutionResult || questionDetails[0].codeExecutionResult.error === "Not evaluated yet"){
                    return res.status(409).json({
                        message:"cant generate summary before coding evaluation "
                    })

                }
            }
        })

        //overall average time calculation logic
        let averageTime;
        let totalTime = 0
        summaryResult.questions.forEach((q) =>{
            if(q.timeTaken){
                totalTime += q.timeTaken;
            }
        })
        const totalQuestions = summaryResult.statsCards.details.length
        const totalAnsweredQuestion = summaryResult.questions.filter((q) => {
            if(q.timeTaken != null){
                return true
            }
        }).length
        averageTime = totalAnsweredQuestion>0?totalTime/totalAnsweredQuestion:0

        //duration calculation
        let duration = 0;
        if(summaryResult.endedAt !=null && summaryResult.startedAt != null){
            duration = (summaryResult.endedAt.getTime()-summaryResult.startedAt.getTime())/(1000*60)
        }
        //topicBreakdown

        //correctness per question will be helpul in topic breakdown check
        const correctnessMap:any = {}
        for(const detail of summaryResult.statsCards.details){
            correctnessMap[detail.questionId] = {
                isCorrect: detail.isCorrect,
                passed:detail.codeExecutionResult?.passed
            }
        }
        //topic breakdown logic
        const topicStats:any = {}
        for(const question of summaryResult.questions){
            const questionId = question.questionId
            const isCorrect = correctnessMap[questionId]?.isCorrect

            for(const topic of question.question.topics){
                const topicName = topic.topic.name
                if(!topicStats[topicName]){
                    topicStats[topicName] = {
                        total:0,
                        correct:0,
                        totalTime:0,
                        timeCount:0,
                        totalAttempted:0
                    }
                }
                topicStats[topicName].total++

                if(isCorrect == true){
                    topicStats[topicName].correct++
                }
                if(question.timeTaken != null){
                    topicStats[topicName].totalTime += question.timeTaken
                    topicStats[topicName].timeCount++
                    
                }
                if(question.skipped == false){
                    topicStats[topicName].totalAttempted++
                }
            }
        }
        const topicBreakdown = []
        for(const topicName in topicStats){
            const total = topicStats[topicName].total
            const totalAttempted = topicStats[topicName].totalAttempted
            const correct = topicStats[topicName].correct
            const totalTime = topicStats[topicName].totalTime
            const timeCount = topicStats[topicName].timeCount

            const accuracy = totalAttempted>0?(correct/totalAttempted)*100:0
            const avgTime = timeCount>0?(totalTime/timeCount):0

            topicBreakdown.push({
                topic:topicName,
                accuracy,
                avgTime
            })

        }

        const isAisummaryAvailable = summaryResult.aiSummaryGenerated
        let aiSummary;
        const improvementFromLastSession = await calculateImporvementFromLastSession(userId, interviewId)
        if(isAisummaryAvailable){
            return res.status(200).json(
                {
                    header: {
                        roleType:summaryResult.roleType,
                        subjects:summaryResult.subjects,
                        difficulty:summaryResult.difficulty,
                        duration: duration,
                        date:summaryResult.startedAt,
                    },
                    overallPerformance: {
                        totalQuestions: totalQuestions,
                        correct:summaryResult.statsCards?.totalCorrect,
                        incorrect:summaryResult.statsCards.totalAttempted-summaryResult.statsCards.totalCorrect,
                        skipped:summaryResult.questions.filter((q) => q.skipped == true).length,
                        accuracy:summaryResult.statsCards.totalAttempted>0?(summaryResult.statsCards.totalCorrect/summaryResult.statsCards.totalAttempted)*100:0,
                        avgTime:averageTime,
                        improvementFromLastSession
                    },
                    topicBreakdown: topicBreakdown,
                    aiAnalysis: {
                        communicationClarity:summaryResult.communicationClarity,
                        conceptDepth :summaryResult.conceptDepth,
                        logicalThinking :summaryResult.logicalThinking,
                        confidenceLevel :summaryResult.confidenceLevel,
                        codeStructure :summaryResult.codeStructure
                    },
                    strengths: summaryResult.strengths,
                    areasToImprove: summaryResult.areasToImprove,
                    recommendedFocus: summaryResult.recommendedFocus
                }
            )
        }
        //if ai summary not availabel then generate it 
        let clarityScore  = 0
        let conceptDepthScore = 0
        let logicalThinkingScore = 0
        let confidenceScore = 0
        let correctnessScore = 0
        let problemSolvingScore = 0
        let codeQualityScore = 0
        let allStrengths:string[] = []
        let allareasToImprove:string[] = []
        summaryResult.questions.forEach((q) =>{
            if(q.clarityScore){
                clarityScore += q.clarityScore
            }
            if(q.conceptDepthScore){
                conceptDepthScore += q.conceptDepthScore
            }
            if(q.logicalThinkingScore){
                logicalThinkingScore += q.logicalThinkingScore
            }
            if(q.confidenceScore){
                confidenceScore += q.confidenceScore
            }
            if(q.correctnessScore){
                correctnessScore += q.correctnessScore
            }
            if(q.problemSolvingScore){
                problemSolvingScore +=q.problemSolvingScore
            }
            if(q.codeQualityScore){
                codeQualityScore += q.codeQualityScore
            }

            q.strengths.map(s => allStrengths.push(s))
            q.areasToImprove.map(i => allareasToImprove.push(i))

        })
        const theoryQuestions = summaryResult.questions.filter(q => q.question.type === "theory")
        const theoryEvaluatedCount = theoryQuestions.filter(q => q.clarityScore !== null).length
        const codingQuestions = summaryResult.questions.filter(q => q.question.type === "coding")
        const codingEvaluatedCount = codingQuestions.filter(q => q.correctnessScore !== null).length

        let aiServiceInput:EvaluateInterviewInput = {
            roleType: summaryResult.roleType,
            subjects: summaryResult.subjects,
            difficulty: summaryResult.difficulty,
            totalQuestions,
            accuracyPercent:summaryResult.statsCards.totalAttempted>0?(summaryResult.statsCards.totalCorrect/summaryResult.statsCards.totalAttempted)*100:0,
        
            avgScores: {
                clarity: theoryEvaluatedCount>0?clarityScore/theoryEvaluatedCount:0,
                conceptDepth: theoryEvaluatedCount>0?conceptDepthScore/theoryEvaluatedCount:0,
                logicalThinking: theoryEvaluatedCount>0?logicalThinkingScore/theoryEvaluatedCount:0,
                confidence: theoryEvaluatedCount>0?confidenceScore/theoryEvaluatedCount:0,
                codeScores: codingEvaluatedCount>0?{
                    averageCorrectnessScore: correctnessScore / codingEvaluatedCount,
                    averageProblemSolvingScore: problemSolvingScore / codingEvaluatedCount,
                    averageCodeQualityScore: codeQualityScore / codingEvaluatedCount
                }:null
            },
            topicBreakdown,
        
            strengths: allStrengths.slice(0, 20)  ,     // capped to 20
            areasToImprove: allareasToImprove.slice(0, 20) ,   // capped to 20
        }


        aiSummary = await evaluateInterviewService_ai(aiServiceInput)
        
        //update interview with this summary
        const updatedSummaryResult= await updateInterviewSummary(interviewId, aiSummary)
        
        return res.status(200).json(
            {
                header: {
                    roleType:summaryResult.roleType,
                    subjects:summaryResult.subjects,
                    difficulty:summaryResult.difficulty,
                    duration: duration,
                    date:summaryResult.startedAt,
                },
                overallPerformance: {
                    totalQuestions: totalQuestions,
                    correct:summaryResult.statsCards?.totalCorrect,
                    incorrect:summaryResult.statsCards.totalAttempted-summaryResult.statsCards.totalCorrect,
                    skipped:summaryResult.questions.filter((q) => q.skipped == true).length,
                    accuracy:summaryResult.statsCards.totalAttempted>0?(summaryResult.statsCards.totalCorrect/summaryResult.statsCards.totalAttempted)*100:0,
                    avgTime:averageTime,
                    improvementFromLastSession
                },
                topicBreakdown: topicBreakdown,
                aiAnalysis: {
                    communicationClarity:updatedSummaryResult.communicationClarity,
                    concetptDepth :updatedSummaryResult.conceptDepth,
                    logicalThinking :updatedSummaryResult.logicalThinking,
                    confidenceLevel :updatedSummaryResult.confidenceLevel,
                    codeStructure :updatedSummaryResult.codeStructure
                },
                strengths: updatedSummaryResult.strengths,
                areasToImprove: updatedSummaryResult.areasToImprove,
                recommendedFocus: updatedSummaryResult.recommendedFocus
            }
        )
        
    } catch (error) {
        console.log("error occured on summary route :- ",error)
        return res.status(500).json({
            message:"error occured on summary route"
        })
    }

    
})

export {interviewRouter}