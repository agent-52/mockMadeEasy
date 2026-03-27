import express from 'express';
import { auth } from '../middlewares/authMiddlewar';
import { getPastSessions } from '../db/sessionQueries';
import { Difficulty, InterviewRole, SubjectType } from '@prisma/client';



const sessionRouter = express.Router()

sessionRouter.get("/",auth,  async (req, res) =>{
    const userId = Number(req.user?.id)
    if(!userId){
        return res.status(403).json({
            message:"user id not found"
        })
    }
    const {roleType, subjects, difficulty, daysRange, sortByScore, page , limit }= req.query

    //pagination logic guards
    const parsedPage = page ? Number(page) : 1
    if (isNaN(parsedPage) || parsedPage < 1) {
        return res.status(400).json({
            message:"not valid page query input"
        })
    }
    if(parsedPage<1){
        return res.status(400).json({
            message:"page must be >=1"
        })
    }
    const parsedLimit = limit?Number(limit):10
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit>50) {
        return res.status(400).json({
            message:"not valid limit query input"
        })
    }

    //query sanitization
    let parsedRoleType: InterviewRole | undefined
    if (roleType) {
        if (!Object.values(InterviewRole).includes(roleType as InterviewRole)) {
            return res.status(400).json({ message: "Invalid roleType" })
        }
        parsedRoleType = roleType as InterviewRole
    }

    let parsedDifficulty: Difficulty | undefined
    if (difficulty) {
        if (!Object.values(Difficulty).includes(difficulty as Difficulty)) {
            return res.status(400).json({ message: "Invalid difficulty" })
        }
        parsedDifficulty = difficulty as Difficulty
    }

    let parsedSort: "asc" | "desc" | undefined
    if (sortByScore) {
        if (sortByScore !== "asc" && sortByScore !== "desc") {
            return res.status(400).json({ message: "Invalid sortByScore" })
        }
        parsedSort = sortByScore
    }

    let parsedSubjects: SubjectType[] | undefined
    if (subjects) {
        const subjectArray = Array.isArray(subjects) ? subjects : [subjects]
        for (const sub of subjectArray) {
            if (!Object.values(SubjectType).includes(sub as SubjectType)) {
            return res.status(400).json({ message: "Invalid subject value" })
            }
        }
        parsedSubjects = subjectArray as SubjectType[]
    }

    let parsedDaysAgo: Date | undefined
    if (daysRange) {
        const parsedDays = Number(daysRange)
        if (isNaN(parsedDays) || parsedDays < 0) {
            return res.status(400).json({ message: "Invalid daysRange" })
        }
        const fromDate = new Date()
        fromDate.setDate(fromDate.getDate() - parsedDays)
        parsedDaysAgo = fromDate
    }
    


    const skip = (parsedPage-1)*parsedLimit
    //dynamic where object for filtering in db
    const whereObject: any = {}

    if (parsedRoleType !== undefined) {
    whereObject.roleType = parsedRoleType
    }

    if (parsedDifficulty !== undefined) {
    whereObject.difficulty = parsedDifficulty
    }

    if (parsedSubjects !== undefined) {
    whereObject.subjects = parsedSubjects
    }

    if (parsedDaysAgo !== undefined) {
    whereObject.daysAgo = parsedDaysAgo
    }

    if (parsedSort !== undefined) {
    whereObject.sortByScore = parsedSort
    }

    const result = await getPastSessions(userId, whereObject,parsedLimit, skip)
    const pastSessionsArray = []
    
    //preProcessing for each session
    for(const session of result.response){
        //score calculation
        const totalQuestions = session.statsCards?.details.length
        const totalAttempted = session.statsCards?.totalAttempted
        const totalCorrect = session.statsCards?.totalCorrect
        let score = 0;
        if(totalAttempted !=null && totalAttempted>0 && totalCorrect!= null){
            score = (totalCorrect/totalAttempted)*100
        }else{
            score = 0
        }
        //outcome label
        let outcomeLabel;
        if(score>= 80){
            outcomeLabel = "strong"
        }else if(score >= 50){
            outcomeLabel = "moderate"
        }else{
            outcomeLabel = "weak"
        }
        //duration calculation
        const duration = session.endedAt?((session.endedAt.getTime()-session.startedAt.getTime())/(1000*60)):null
        //days ago calculation
        const todaysDate = new Date()
        const daysAgo = Math.floor((todaysDate.getTime() - session.startedAt.getTime())/(1000*60*60*24))

        //unique topic array
        const uniqueTopicArray:string[] = [];
        session.questions.forEach((q) =>{
            q.question.topics.forEach((t) => {
                const topicName = t.topic.name
                if(!uniqueTopicArray.includes(topicName)){
                    uniqueTopicArray.push(topicName)
                }
            })
        })

        //action flag
        const canViewSummary = session.status === "completed"
        const canReviewAnswer = session.status === "completed"
        const canRetake = true

        pastSessionsArray.push({
            interviewId:session.id,
            roleType:session.roleType,
            subjects:session.subjects,
            difficulty:session.difficulty,

            topics: uniqueTopicArray,

            score:score,
            outcome:outcomeLabel,

            totalAttempted,
            totalCorrect,
            totalQuestions,

            durationMinutes:duration,
            daysAgo,

            phase:session.phase,
            status:session.status,

            createdAt:session.startedAt,

            actions:{
                canViewSummary,
                canReviewAnswer,
                canRetake
            }
        })
    }

    //pagination logic
    
    const totalSessions = result.total
    const totalPages = Math.ceil(totalSessions/parsedLimit)
    

    return res.status(200).json({
        sessions:pastSessionsArray,
        pagination:{
            totalSessions,
            page:parsedPage,
            limit:parsedLimit,
            totalPages
        }
    })

})

export{sessionRouter}