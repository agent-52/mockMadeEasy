1️⃣ AUTH
POST /auth/login

Request:

{
  email: string,
  password: string
}


Response:

{
  accessToken: string,
  refreshToken: string,
  user: {
    id: string,
    name: string,
    role: "user" | "admin",
    plan: "FREE" | "PRO" | "ELITE"
  }
}

POST /auth/refresh (Future-ready)
{
  refreshToken: string
}

2️⃣ INTERVIEW CREATION FLOW
POST /interview/preview

Purpose: calculate structure without DB creation.

Request:

{
  roleType: "frontend" | "backend" | "fullstack" | "dsa",
  stack?: {
    frontend?: string,
    backend?: string,
    database?: string
  },
  difficulty: "easy" | "medium" | "hard",
  topics: string[],
  includeIntro: boolean,
  mode: "theory" | "coding" | "mixed",
  questionCount: number
}


Response:

{
  estimatedDuration: number,
  totalQuestions: number,
  breakdown: {
    theory: number,
    coding: number
  },
  followUpEnabled: boolean,
  planRestriction?: string
}

POST /interview/create

Creates interview.

Request:

{
  roleType: "frontend" | "backend" | "fullstack" | "dsa",

  subjects: ["react", "node"],

  difficulty: "easy" | "medium" | "hard",

  topicIds: number[],

  includeIntro: boolean,

  questionCount: number
}


Response:

{
  interviewId: string,
  status: "active",
  phase: "base"
}

3️⃣ INTERVIEW SESSION FLOW
GET /interview/:interviewId

Response:

{
  sessionMeta: {
    roleType,
    subjects,
    difficulty,
    phase,
    status,
    estimatedDuration,
    includeIntro
  },
  questions: [
    {
      interviewQuestionId,
      questionId,
      type: "theory" | "coding",
      difficulty,
      topic,
      title,
      expectedTime,
      constraints?,
      starterCode?
    }
  ]
}

POST /interview/:interviewId/answer

Request:

{
  interviewQuestionId: string,
  transcript?: string,
  code?: string,
  timeTaken: number,
  skipped: boolean
}


Response:

{
  nextQuestionOrder: number | null,
  answered: number,
  phase: "base" | "followup" | "completed",
  interviewCompleted: boolean
}

4️⃣ EVALUATION
POST /interview/:interviewId/evaluate

Evaluates current phase (base/followup).

Response:

{
  interviewId:number,
  previousPhase:"base"|"followup",
  phaseAfterEvaluation: "followup" | "completed",
  followUpsInjected: boolean
}

POST /interview/:interviewId/evaluate-code

(Async safe)

Response:

{
  interviewId:number,
  codingEvaluated:boolean,
  results: [
    {
      questionId,
      interviewQuestionId,
      passed: boolean,
      runtimeMs?,
      error?
    }
  ]
}

SKIP FOLLOWUPS

POST /interview/:interviewId/skip-followup

Response:

{
  "interviewId": number,
  "previousPhase": "followup",
  "nextPhase": "completed",
  "skippedCount": number
}

5️⃣ STATUS ROUTE
GET /interview/:interviewId/status
{
  phase,
  canSkipFollowup: boolean,
  canEvaluateCode: boolean,
  codingEvaluated: boolean
}

6️⃣ SUMMARY SCREEN (MVP LOCKED)
GET /interview/:interviewId/summary

Response:

{
  header: {
    role,
    stack,
    mode,
    duration,
    date
  },
  overall: {
    totalQuestions,
    correct,
    incorrect,
    skipped,
    accuracy,
    avgTime,
    improvementFromLastSession?
  },
  topicBreakdown: [
    {
      topic,
      accuracy,
      avgTime,
      trend?
    }
  ],
  aiAnalysis?: {
    communicationClarity,
    conceptDepth,
    logicalThinking,
    confidence,
    codeStructure
  },
  strengths?: string[],
  improvements?: string[],
  recommendedFocus?: string[]
}


AI fields optional until v1.

PAST_SESSIONS

GET/sessions

Query parameters

roleType
subjects[]            // filter by subject
difficulty
minScore
maxScore
startDate
endDate
page
limit

{
  sessions: [
    {
      interviewId: number,

      roleType: string,
      subjects: string[],
      difficulty: string,

      topics: string[],                 // unique topics in that interview

      score: number,                    // accuracy %
      outcome: "strong" | "moderate" | "weak",

      totalQuestions: number,
      totalAttempted: number,
      totalCorrect: number,

      durationMinutes: number,
      daysAgo: number,

      phase: "base" | "followup" | "completed",
      status: "active" | "completed",

      createdAt: Date,

      actions: {
        canViewSummary: boolean,
        canReviewAnswers: boolean,
        canRetake: boolean
      }
    }
  ],

  pagination: {
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }
}

7️⃣ REVIEW SCREEN
GET /interview/:interviewId/review
{
  questions: [
    {
      interviewQuestionId,
      order,
      title,
      description,
      type,
      difficulty,
      topics,
      userAnswer,
      idealAnswer?,
      gapAnalysis?,
      aiEvaluation?,
      timeTaken,
      score,
      skipped,
      isCorrect,
      passed?
    }
  ]
}

8️⃣ DASHBOARD
GET /dashboard/overview

Response:

{
  primaryAction: {
    hasOngoingSession: boolean,
    ongoingInterviewId: number | null
  },

  statsOverview: {
    interviewsCompleted: number,
    primaryFocus: string,        // e.g. "Frontend (React)"
    avgClarityScore: number | null,
    weakArea: string | null
  },

  recommendedPractice: [
    {
      type: string,              // "Frontend"
      topics: string[],
      reason: string
    }
  ],

  recentSessions: [
    {
      interviewId: number,
      roleType: string,
      interviewName: string,
      topics: string[],
      totalQuestions: number,
      totalCorrect: number,
      feedbackSummary: string | null,
      outcome: "Strong answers" | "Good clarity" | "Needs improvement",
      status: "completed" | "incomplete",
      createdAt: string
    }
  ],

  practiceConsistency: {
    sessionsThisWeek: number
  }
}

GET /sessions

With filters:

?role=
&difficulty=
&dateFrom=
&dateTo=
&scoreMin=

9️⃣ PRICING / PLAN GATING

Middleware:

checkPlanAccess("coding")
checkPlanAccess("gap-analysis")
checkPlanAccess("cv-interview")


Plan matrix stored in DB:

Subscription
PlanFeature

🔟 FUTURE (Already Contracted)

These must exist in contract now:

POST /interview/:interviewId/generate-followups

(For advanced adaptive engine)

POST /interview/:interviewId/evaluate-ai

(Triggers full AI scoring)

POST /interview/cv-generate

(Upload CV → create interview)

POST /interview/:interviewId/transcript-chunk

(Stream transcript)

GET /dashboard/trends
POST /video/presence