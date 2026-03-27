
import { NextFunction, Request, Response } from "express";
import { findInterviewQuestions } from "../db/interviewQuestions";
import { prisma } from "../db/db";

export async function questionInterviewRelationCheck(req:Request, res:Response, next: NextFunction){
    const interviewId = Number(req.params.interviewId)
    const interviewQuestionId = req.body.interviewQuestionId
    if (!interviewQuestionId) {
        return res.status(400).json({
            message: "interviewQuestionId is required"
        })
    }
    const exists = await prisma.interviewQuestion.findFirst({
    where: {
      id: interviewQuestionId,
      interviewId
    },
    select: { id: true }
  })

  if (!exists) {
    return res.status(400).json({
      message: "question does not belong to this interview"
    })
  }
    next()
}