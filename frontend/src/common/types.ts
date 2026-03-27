

//session screen types

type InterviewType = "Frontend" | "Backend" | "Full Stack" | "DSA";
type Mode = "theory" | "coding";

interface Question {
   id: number;
  title: string;
  difficulty: "easy"| "medium"| "hard";
  slug: string;
  description: string | null;
  followUpToQuesitonId: number | null;
  type: "theory" | "coding" | null;
  constraints: string | null;
  inputFormat: string | null;
  outputFormat: string | null;
  starterCode: string | null;
  averageTime: number;
  createdAt: Date;
}

interface InterviewSessionProps {
  interviewType: InterviewType;
  stackLabel: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export type {InterviewSessionProps, Question, InterviewType, Mode}