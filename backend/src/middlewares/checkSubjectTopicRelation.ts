import { SubjectType } from "@prisma/client"
import { prisma } from "../db/db"

async function checkSubjectTopicRelation(
  subjectArray: SubjectType[],
  topicIds: number[]
): Promise<boolean> {

  const subjects = await prisma.subject.findMany({
    where: {
      title: { in: subjectArray }
    },
    select: {
      topics: {
        select: { id: true }
      }
    }
  })

  const allowedTopicIds = new Set<number>()

  subjects.forEach(subject => {
    subject.topics.forEach(topic => {
      allowedTopicIds.add(topic.id)
    })
  })

  for (const id of topicIds) {
    if (!allowedTopicIds.has(id)) {
      return false
    }
  }

  return true
}

export {checkSubjectTopicRelation}