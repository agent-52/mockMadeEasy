
import React, { useEffect, useMemo, useRef, useState } from "react";
import { InterviewHeader } from "../components/InterviewSession/Header";
import { QuestionPanel } from "../components/InterviewSession/QuestionPanel";
import { TheoryAnswerPanel } from "../components/InterviewSession/AnswerPanel";
import { CodingAnswerPanel } from "../components/InterviewSession/CodingPanel";
import { ActionBar } from "../components/InterviewSession/ActionBar";
import "../SessionScreen.css"
import "../utilities.css"
/* =========================
   TYPES
========================= */

import type { InterviewSessionProps, Question } from "../common/types";
import { useMatch, useNavigate, useParams } from "react-router";
import { interviewStore } from "../store/interview.store";
import { evaluateCode, evaluatePhase, fetchCurrentQuestion, skipFollowups, submitAnswer, type AnswerPayload } from "../api/interview.api";


/* =========================
   MAIN SCREEN
========================= */

type TheoryPanelRef = {
  stopRecording: () => void
}

export const InterviewSessionScreen: React.FC<InterviewSessionProps> = ({
  interviewType,
  stackLabel,
  difficulty
}) => {
  
  const [isExitOpen, setIsExitOpen] = useState(false);
  const [showFollowupDecision, setShowFollowupDecision] = useState(false)
  const [interviewCompleted, setInterviewCompleted] = useState(false)
  const [answerDraft, setAnswerDraft] = useState({
    response: "",
    skipped:false,
  })

  const timerRef = useRef(0)
  const theoryPanelRef = useRef<TheoryPanelRef | null>(null)

  const navigate = useNavigate()
  const {id} = useParams()
  const parsedInterviewId = useMemo(() => Number(id), [id])

  const interviewId = interviewStore((s:any) => s.interviewId)
  const phase = interviewStore((s:any) => s.phase)
  const currentQuestion = interviewStore((s:any) => s.currentQuestion)
  
  const setInterviewId = interviewStore((s:any) => s.setInterviewId)
  const setFetchingQuestion = interviewStore((s:any) => s.setFetchingQuestion)
  const setQuestionData = interviewStore((s:any) => s.setQuestionData)
  const setProgressData = interviewStore((s:any) => s.setProgressData)

  const setEvaluatingPhase = interviewStore((s:any) => s.setEvaluatingPhase)
  const setEvaluatingCode = interviewStore((s:any) => s.setEvaluatingCode)
  const setSubmittingAnswer = interviewStore((s:any) => s.setSubmittingAnswer)
  const setError = interviewStore((s:any) => s.setError)


  async function handleAnswerFollowups(){
    try {
      setFetchingQuestion(true)
      const questionData = await fetchCurrentQuestion(interviewId)
      setQuestionData({
        question: questionData.firstQuestion,
        audioUrl: questionData.firstQuestionAudioUrl,
        transition: questionData.transition,
        phase: questionData.phase

      })
      timerRef.current = Date.now()
      setAnswerDraft({
        response: "",
        skipped:false
      })
      setProgressData({answeredCount:0, totalQuestions: questionData.totalQuestions})
    } catch (error) {
      setError(error instanceof Error ? error.message:"an error occured")
    }finally{
      setFetchingQuestion(false)
      setShowFollowupDecision(false)
      setInterviewCompleted(false)
    }
  }

  async function handleSkipFollowup() {
    try {
      const response = await skipFollowups(interviewId)
      if(response.nextPhase === "completed"){
        try {
          setEvaluatingCode(true)
          await evaluateCode(interviewId)
          navigate(`/interview/${interviewId}/summary`)
        } catch (error) {
          setError(error instanceof Error ? error.message : "An error occurred")
        }finally{
          setEvaluatingCode(false)
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message:"an error occured")
    }finally{
      setShowFollowupDecision(false)
    }
  }

  const handleEvaluateFlow = async () =>{
    // interviewId,
    //         previousPhase:previousPhase,
    //         nextPhase:nextPhase,
    //         followupInjected
    try {
      setEvaluatingPhase(true)
      const response = await evaluatePhase(interviewId)

      if(response.followupInjected){
        setShowFollowupDecision(true)
      }
      if(response.nextPhase === "completed"){
        try {
          setEvaluatingCode(true)
          await evaluateCode(interviewId)
          navigate(`/interview/${interviewId}/summary`)
        } catch (error) {
          setError(error instanceof Error ? error.message : "An error occurred")
        }finally{
          setEvaluatingCode(false)
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    }finally{
      setEvaluatingPhase(false)
    }
  }
  
  const handleSubmitAnswer = async () =>{
    //guard
    if(!interviewId || !currentQuestion){
      return 
    }
    const payload:AnswerPayload = {
      interviewQuestionId: currentQuestion.interviewQuestionId,
      ...answerDraft,
      timeTaken: Date.now() - timerRef.current
    }
    if(theoryPanelRef.current){
      theoryPanelRef.current.stopRecording()
    }

    try {
      setSubmittingAnswer(true)
      const response = await submitAnswer(interviewId, payload)
      setQuestionData({
        question:response.nextQuestion,
        audioUrl: response.nextQuestionAudioUrl,
        transition: response.transition,
        phase: response.phase
      })
      setAnswerDraft({
        response: "",
        skipped:false
      })
      setProgressData({
        answeredCount:response.answeredQuestions,
        totalQuestions:response.totalQuestions,
      })

      timerRef.current = Date.now()

      if(response.interviewCompleted == true){
        setInterviewCompleted(true)
        //trigger evaluation
        await handleEvaluateFlow()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    }finally{
      setSubmittingAnswer(false)
    }


  }

 useEffect(() => {
  const initializeInterview = async () => {
    try {
      if(theoryPanelRef.current){
        theoryPanelRef.current.stopRecording()
      }
      setFetchingQuestion(true)
      
      const questionData = await fetchCurrentQuestion(parsedInterviewId)
      console.log(questionData)
      if (questionData.completed) {
        navigate(`/interview/${id}/summary`)
      }
      setQuestionData({
        question: questionData.firstQuestion,
        audioUrl: questionData.firstQuestionAudioUrl,
        transition: questionData.transition,
        phase: questionData.phase

      })
      timerRef.current = Date.now()
      setAnswerDraft({
        response: "",
        skipped:false
      })
      setProgressData({answeredCount:0, totalQuestions: questionData.totalQuestions})

    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    }finally{
      setFetchingQuestion(false)
    }
  }
  if(id){
    setInterviewId(parsedInterviewId)
    initializeInterview()
  }
 }, [id])

  

  

  return (
    <div className="session-screen bg1">

      <InterviewHeader
        interviewType={interviewType}
        stackLabel={stackLabel}
        difficulty={difficulty}
        interviewId={parsedInterviewId}
        onExit={() => setIsExitOpen(true)}
      />

      {!currentQuestion?<div>Loading...</div>:<div className="session-body">

        <QuestionPanel question={currentQuestion} handleSubmit={handleSubmitAnswer} interviewCompleted={interviewCompleted} answerDraft={answerDraft}  setAnswerDraft={setAnswerDraft}/>

        {currentQuestion.type === "theory" ? (
          <TheoryAnswerPanel answerDraft={answerDraft}  setAnswerDraft={setAnswerDraft} handleSubmitAnswer={handleSubmitAnswer} ref={theoryPanelRef} question={currentQuestion}/>
        ) : (
          <CodingAnswerPanel answerDraft={answerDraft}  setAnswerDraft={setAnswerDraft}/>
        )}
      </div>}

      <ActionBar
        onExit={() => setIsExitOpen(true)}
      />

      <ExitConfirmationModal
        isOpen={isExitOpen}
        onConfirm={() => alert("Exit confirmed")}
        onCancel={() => setIsExitOpen(false)}
      />

      <FollowupModal isOpen={showFollowupDecision} onAnswer={handleAnswerFollowups} onSkip={handleSkipFollowup} />
    </div>
  );
};

/* =========================
   EXIT MODAL
========================= */

const ExitConfirmationModal: React.FC<{
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <p>Your progress will be saved. Exit interview?</p>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};



const FollowupModal:React.FC<{
  isOpen: boolean
  onSkip: () => void;
  onAnswer: () => void
}> = ({isOpen, onAnswer, onSkip}) => {
  if(isOpen == false) return null
  return (
    <div>
      <h1>Based on your response we have some followups for you</h1>
      <div>
        <button onClick={onAnswer}>Answer Followups</button>
        <button onClick={onSkip}>Skip Followups</button>
      </div>
    </div>
  )
}
