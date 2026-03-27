import express from 'express';
import { auth } from '../middlewares/authMiddlewar';
import { countSessionsAboveADate, findCompletedInterviews, findOngoingInterview } from '../db/dashboardQueries';
import { getPastSessions } from '../db/sessionQueries';


const dashboardRouter = express.Router()

type RecommendedPractice = {
    subject: string,
    subjectId: number,
    topics:
    {
        topic: string,
        topicId: number
    }[]
    ,
    reason: string
}
type TopicStat = {
    topicId: number
    topicName: string
    subjectId: number
    subjectName: string
    correct: number
    totalAttempted: number
}
type RecentSessions = {
    interviewId: number,
    roleType: string,
    subjects: string[],
    topics: string[],
    totalQuestions?: number ,
    totalCorrect?: number ,
    outcome: "Strong answers" | "Good clarity" | "Needs improvement",
    feedback?:string,
    status: "completed" | "incomplete",
    createdAt: string
}
dashboardRouter.get("/overview",auth, async (req, res)=>{
    const userId = req.user?.id

    //guards
    if(!userId){
        return res.status(411).json({
            message:"user id not fount please login/signup"
        })
    }

    try{
        
        //ongoing interview logic
        let hasOngoingSession = false
        let ongoingInterviewId;
        const ongoingSessions = await findOngoingInterview( userId)
        if(ongoingSessions.length == 0){
            hasOngoingSession = false
        }else{
            hasOngoingSession = true
            ongoingInterviewId = ongoingSessions[0]?.id
        }

        //stat overview logic
        let completedInterviewsCount = 0
        let primarySubject;
        let avgClarityScore;
        let weakArea:{topic:string, topicId:number} |null = null;

        const completedInterviews = await findCompletedInterviews(userId)

        completedInterviewsCount = completedInterviews.length

            //primary subject = most frequent subject
        let subjectFrequencyDictionary:Record<string,number> ={}
        completedInterviews.forEach((interview) =>{
            interview.subjects.forEach((subject) =>{
                if(!subjectFrequencyDictionary[subject]){
                    subjectFrequencyDictionary[subject] = 0
                }
                subjectFrequencyDictionary[subject]++
            })
        })
        let maxFrequency = 0
        for(const subject in subjectFrequencyDictionary){
            if(subjectFrequencyDictionary.hasOwnProperty(subject)){
                const value = subjectFrequencyDictionary[subject]
                if(value !=null && value>maxFrequency){
                    maxFrequency = value
                    primarySubject = subject
                }
            }
        }

            //avgClarityScore :- for mvp avg of accuracy of last 5 completed sessions , 
            //v1:- ai clarity metrics
        let clarityTotal = 0;
        let clarityCount = 0;
        for(let i = 0; i<5; i++){
            const interview = completedInterviews[i]
            if(!interview){
                break
            }
            const accuracy = completedInterviews[i]?.statsCards?.accuracy
            if(accuracy != null){
                clarityTotal += accuracy
                clarityCount++    
            }
        }
        avgClarityScore = clarityCount>0?clarityTotal/clarityCount:null

        //recommended practice logic
            //if past sessions then based on weak topic (low accuracy topics)else some pre selected interviews one frontend one backend on fullstack etc
        let recommendedPractice:RecommendedPractice[] = []

        if(completedInterviews.length>0){
            const topicStats: Record<string, TopicStat> = {}
            completedInterviews.forEach((interview) => {
                const correctnessMap:any = {}
                if(interview.statsCards){
                    for(const detail of interview.statsCards.details){
                        correctnessMap[detail.questionId] = {
                            isCorrect: detail.isCorrect,
                        }
                    }
                }
                //topic breakdown logic
                
                for(const question of interview.questions){
                    const questionId = question.questionId
                    const isCorrect = correctnessMap[questionId]?.isCorrect

                    for(const topicRelation of question.question.topics){
                        const topic = topicRelation.topic
                        if(!topicStats[topic.name]){
                            topicStats[topic.name] = {
                                topicId: topic.id,
                                topicName:topic.name,
                                subjectId:topic.subjectId,
                                subjectName: topic.subject.title,
                                correct:0,
                                totalAttempted:0
                            }
                        }
                        const stat = topicStats[topic.name]
                        if(stat && question.skipped == false){
                            stat.totalAttempted++
                            if(isCorrect){
                                stat.correct++
                            }
                        }    
                    }
                }

            })
            //topicwiese accuracy maping in ascending order
            const topicAccuracyArray = Object.values(topicStats)
                .map(t => ({
                    ...t,
                    accuracy: t.totalAttempted > 0
                        ? t.correct / t.totalAttempted
                        : 0
                }))
                .sort((a, b) => a.accuracy - b.accuracy)


            //weak area for stat overview cards can be found from here topic with lowest accuracy
            if(topicAccuracyArray.length>0 && topicAccuracyArray[0]){
                weakArea = {
                    topic: topicAccuracyArray[0]?.topicName,
                    topicId: topicAccuracyArray[0]?.topicId
                }
            }
            
            //grouping by subject with max 3 topics per subject
            const subjectBucket:Record<number, {
                subject:string,
                subjectId:number,
                topics: {topic:string, topicId:number}[]
            }> = {}
            for (const topic of topicAccuracyArray){
                if(!subjectBucket[topic.subjectId]){
                    subjectBucket[topic.subjectId] = {
                        subject:topic.subjectName,
                        subjectId:topic.subjectId,
                        topics:[]
                    }
                }
                const subjectObject = subjectBucket[topic.subjectId]
                if(subjectObject){
                    if(subjectObject.topics.length<3){
                        subjectObject.topics.push({
                            topic:topic.topicName,
                            topicId:topic.topicId
                        })
                    }
                }
            }
            recommendedPractice = Object.values(subjectBucket).slice(0,3).map(bucket => ({
                subject: bucket.subject,
                subjectId:bucket.subjectId,
                topics: bucket.topics,
                reason: `You struggled with ${bucket.topics.map(t => t.topic).join(", ")} in recent sessions.`
            }))


        }else{
            recommendedPractice = [
                {
                    subject: "React",
                    subjectId: 4,
                    topics: [
                    { topic: "Hooks", topicId: 119 },
                    { topic: "State Management", topicId: 114 },
                    { topic: "useEffect", topicId: 123 }
                    ],
                    reason: "Hooks and state management are among the most frequently asked topics in frontend interviews."
                },
                {
                    subject: "Node",
                    subjectId: 3,
                    topics: [
                    { topic: "REST APIs", topicId: 84 },
                    { topic: "async programming", topicId: 75 }
                    ],
                    reason: "Backend interviews commonly test API design and authentication concepts."
                },
                {
                    subject: "DSA",
                    subjectId: 2,
                    topics: [
                    { topic: "Arrays", topicId: 35 },
                    { topic: "Sliding Window", topicId: 49 }
                    ],
                    reason: "Array-based problems and sliding window techniques are foundational in coding interviews."
                }

            ]
        }

        //recent sessions :- last 4 completed interview
        const recentSessionsArray:RecentSessions[] = []
        const recentSessions = await getPastSessions(userId, {},4,0)

        recentSessions.response.forEach((session) =>{
            
            let outcume:any = "Good clarity";
            if(session.statsCards?.accuracy != null){
                if(session.statsCards.accuracy>=80){
                    outcume = "Strong answers"
                }else if(session.statsCards.accuracy>=50){
                    outcume = "Good clarity"
                }else{
                    outcume = "Needs improvement"
                }
            }
            let today = new Date();
            const createdAt = Math.round((today.getTime()- session.startedAt.getTime())/(1000*60*60*24))

            let status:"completed"|"incomplete";
            if(session.phase === "completed"){
                status = "completed"
            }else{
                status = "incomplete"
            }

            let topicArray:string[] = []
            session.questions.forEach((q) => {
                q.question.topics.forEach((t) =>{
                    if(!topicArray.includes(t.topic.name)){
                        topicArray.push(t.topic.name)
                    }
                })
            })

            if(session.statsCards){
                recentSessionsArray.push({
                    interviewId: session.id,
                    roleType: session.roleType,
                    subjects: session.subjects,
                    topics: topicArray,
                    totalQuestions: session.statsCards?.details.length,
                    totalCorrect: session.statsCards?.totalCorrect,
                    outcome: outcume,
                    feedback: "no ai evaluation yet",
                    status: status,
                    createdAt: createdAt >=1? createdAt+" days ago":"today"
                })
            }
        })

        //practice consistency logic

        let fromDate = new Date()
        fromDate.setDate(fromDate.getDate()-7)

        const consistencyCount = await countSessionsAboveADate(userId, fromDate)

        const result = {
            primaryAction: {
                hasOngoingSession,
                ongoingInterviewId
            },

            statsOverview: {
                interviewsCompleted:completedInterviewsCount,
                primaryFocus: primarySubject,        // e.g. "Frontend (React)"
                avgClarityScore: avgClarityScore,
                weakArea: weakArea
            },

            recommendedPractice: recommendedPractice,

            recentSessions: recentSessionsArray,

            practiceConsistency: {
                sessionsThisWeek: consistencyCount
            }
        }

        return res.status(200).json(result)
    }catch(error){
        console.log("error in dashboard route :- ",error)
        return res.status(500).json({
            message:"cant fetch dashboard details"
        })
    }


})

export {dashboardRouter}