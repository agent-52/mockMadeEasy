import { data } from "react-router"
import { apiClient } from "./apiClient"


export type AnswerPayload = {
    interviewQuestionId:number,
    response:string,
    timeTaken:number,
    skipped:boolean,
    language?:string
}

export type PreviewPayload = {
    roleType:string | null,
    subjects: string[],
    difficulty: "easy" | "medium" | "hard",
    topicIds?:number[],
    includeIntro:boolean,
    questionCount:number
}

export type CreationPayload = {
    roleType:string | null,
    subjects: string[],
    difficulty: "easy" | "medium" | "hard",
    topicIds?:number[],
    includeIntro:boolean,
    questionCount:number,
    seed:string
}

export type SubjectResponse = {
    
    id:number,
    name: string,
    category:string
    
}

export const fetchCurrentQuestion = async (interviewId:number) => {
    const response = await apiClient.get(`/api/interview/${interviewId}/question`)
    console.log(data)
    return response.data
}

export const submitAnswer = async (interviewId:number, payload:AnswerPayload) => {
    const response = await apiClient.post(`/api/interview/${interviewId}/answer`, payload)
    return response.data
}

export const evaluatePhase = async(interviewId:number) =>{
    const response = await apiClient.post(`/api/interview/${interviewId}/evaluate` )
    return response.data
}

export const evaluateCode = async (interviewId:number) => {
    const response = await apiClient.post(`/api/interview/${interviewId}/evaluate-code`)
    return response.data
}

export const skipFollowups = async (interviewId:number) => {
    const response = await apiClient.post(`/api/interview/${interviewId}/skip-followup`)
    return response.data
}

export const previewInterview = async (payload:PreviewPayload) => {
    const reponse = await apiClient.post("/api/interview/preview", payload)
    return reponse.data
}

export const createInterview = async (payload:CreationPayload) => {
    const response = await apiClient.post("/api/interview/", payload)
    return response.data
}

export const getSubjects = async () => {
    const response = await apiClient.get("/api/setup/subjects")
    console.log(response.data)
    return response.data
}

export const getTopicBySubject = async (subjectId:number) => {
    const response = await apiClient.get(`/api/setup/subjects/${subjectId}/topics`)
    return response.data
}

export const getInterviewSummary = async (interviewId:number) => {
    const response = await apiClient.get(`/api/interview/${interviewId}/summary`)
    return response.data
}

export const getQuestionsReview = async (interviewId:number) => {
    const response = await apiClient(`/api/interview/${interviewId}/review`)
    return response.data
}

export const getDashboardOverview = async () => {
    const response = await apiClient(`/api/dashboard/overview`)
    return response.data
}

