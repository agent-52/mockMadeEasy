type TransitionContext =
  | "afterAnswer"
  | "interviewStart"
  | "interviewEnd"
  | "movingNext"
  | "codingStart"
  | "thinking"
  | "followup"

const transitionPool: Record<TransitionContext, string[]> = {
  afterAnswer: [
    "Alright.",
    "Got it.",
    "Okay."
  ],

  followup: [
    "We have some follow up questions for you based on your answers. Let's begin with the first one."
  ],

  movingNext: [
    "Let’s move to the next question.",
    "Alright, moving ahead.",
    "Now let’s explore another area."
  ],

  thinking: [
    "Take your time.",
    "Think it through.",
    "Consider edge cases.",
    "Walk me through your logic."
  ],

  codingStart: [
    "You can start coding now.",
    "Let’s implement this.",
    "Go ahead and write your solution."
  ],

  interviewStart: [
    "Welcome. Let’s begin.",
    "Alright, let’s get started.",
    "We’ll start with something simple."
  ],

  interviewEnd: [
    "That concludes the interview.",
    "Good effort today.",
    "We’ll wrap up here."
  ]
}

let lastLine: string | null = null

export function generateTransition(context: TransitionContext): string {

  const pool = transitionPool[context]

  if (!pool || pool.length === 0) {
    return ""
  }

  let attempts = 0
  let line = pool[Math.floor(Math.random() * pool.length)]

  while (line === lastLine && attempts < 5) {
    line = pool[Math.floor(Math.random() * pool.length)]
    attempts++
  }

  if(line){
    lastLine = line

    return line
  }
  return ""
}