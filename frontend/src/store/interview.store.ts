import { create } from "zustand";


export const interviewStore = create((set) => ({
    interviewId:null,
    phase:null,
    // status:null,
    currentQuestion:null,
    transition: null,
    answeredCount:0,
    totalQuestions:0,
    currentQuestionAudioUrl:null,

    isFetchingQuestion:false,
    isSubmittingAnswer:false,
    isEvaluatingPhase:false,
    isEvaluatingCode:false,

    error:null,

    setInterviewId: (id:number) => set({interviewId: id}),

    setFetchingQuestion: (value:boolean) => set({isFetchingQuestion: value}),

    setSubmittingAnswer: (value:boolean) => set({isSubmittingAnswer: value}),

    setEvaluatingPhase: (value:boolean) => set({isEvaluatingPhase: value}),

    setEvaluatingCode: (value:boolean) => set({isEvaluatingCode: value}),

    setError: (value:any) => set({error: value}),

    setQuestionData: ({question, audioUrl, transition, phase}:{question:any, audioUrl:string, transition:{text:string, audioUrl:string}, phase:any}) => set({currentQuestion:question,
      currentQuestionAudioUrl:audioUrl,  transition, phase}),

    setProgressData:({answeredCount, totalQuestions}:{answeredCount:number, totalQuestions:number}) => set({answeredCount:answeredCount, totalQuestions:totalQuestions}),

    resetInterview: () =>
    set({
      interviewId: null,
      phase: null,
      status: null,
      currentQuestion: null,
      transition: null,
      answeredCount: 0,
      totalQuestions: 0,
      isFetchingQuestion: false,
      isSubmittingAnswer: false,
      isEvaluatingPhase: false,
      isEvaluatingCode: false,
      error: null,
    }),

}))