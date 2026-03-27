import { Subject, SubjectType } from "@prisma/client"
import { seededShuffle } from "../../utils/seededShuffle"

type SelectorInput ={
    availabelQuestions: any[]
    seed:string,
    subjects: SubjectType[],
    questionCount:number
}

export function selectQuestions({availabelQuestions,
  subjects,
  questionCount,
  seed}:SelectorInput){
   const codingPool = availabelQuestions.filter(q => q.type === "coding")
  const theoryPool = availabelQuestions.filter(q => q.type === "theory")

  const codingRatio = codingPool.length / availabelQuestions.length
  let globalCodingRemaining = Math.round(codingRatio * questionCount)
  let globalTheoryRemaining = questionCount - globalCodingRemaining

  const perSubject = Math.floor(questionCount / subjects.length)
  let remainder = questionCount % subjects.length

  let selected: any[] = []

  for (const subject of subjects) {

    const subjectPool = availabelQuestions.filter(q =>
      q.topics.some((t:any) => t.topic.subject.title === subject)
    )

    const subjectCoding = subjectPool.filter(q => q.type === "coding")
    const subjectTheory = subjectPool.filter(q => q.type === "theory")

    const subjectCodingRatio =
      subjectPool.length > 0
        ? subjectCoding.length / subjectPool.length
        : 0

    let subjectCodingTarget = Math.round(subjectCodingRatio * perSubject)
    let subjectTheoryTarget = perSubject - subjectCodingTarget

    subjectCodingTarget = Math.min(subjectCodingTarget, globalCodingRemaining)
    subjectTheoryTarget = Math.min(subjectTheoryTarget, globalTheoryRemaining)

    const shuffledCoding = seededShuffle(subjectCoding, seed + subject + "c")
    const shuffledTheory = seededShuffle(subjectTheory, seed + subject + "t")

    selected.push(...shuffledCoding.slice(0, subjectCodingTarget))
    selected.push(...shuffledTheory.slice(0, subjectTheoryTarget))

    globalCodingRemaining -= subjectCodingTarget
    globalTheoryRemaining -= subjectTheoryTarget
  }

  // Handle remainder
  if (remainder > 0) {
    const remainingPool = availabelQuestions.filter(
      q => !selected.includes(q)
    )

    const shuffledRemaining = seededShuffle(remainingPool, seed + "remainder")
    selected.push(...shuffledRemaining.slice(0, remainder))
  }

  // Final shuffle
  selected = seededShuffle(selected, seed + "final")

  return selected.slice(0, questionCount)
}