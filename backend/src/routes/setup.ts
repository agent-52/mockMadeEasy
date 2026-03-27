import express from 'express';
import { getSubjects, getTopicsBySubject } from '../db/setUpQueries';
import { title } from 'node:process';


export const setupRouter = express.Router()

setupRouter.get("/subjects", async(req, res) => {
    const subjectsResponse = await getSubjects()
    if(subjectsResponse.length == 0){
        return res.status(400).json({
            message:"subjects not found"
        })
    }
    const properResponse = subjectsResponse.map(s => ({
        id: s.id,
        title:s.title,
        category:s.categoty
    }))
    return res.json(properResponse)
})

setupRouter.get("/subjects/:id/topics", async(req, res) =>{
    const subjectId = Number(req.params.id)
    const topics = await getTopicsBySubject(subjectId)
    return res.json(topics)
})