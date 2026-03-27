/// <reference types="node" />

import {
  PrismaClient,
  Difficulty,
  QuestionType,
  SubjectType,
  SubjectCategory
} from "@prisma/client"

import * as fs from "fs"
import * as path from "path"

const prisma = new PrismaClient()

// ---------- Types for JSON files ----------

interface TestCaseInput {
  input: string
  expectedOutput: string
  isPublic?: boolean
}

interface QuestionInput {
  title: string
  description?: string
  difficulty: Difficulty
  type?: QuestionType
  constraints?: string
  inputFormat?: string
  outputFormat?: string
  starterCode?: string
  averageTime?: number
  topics: string[]
  companies: string[]
  testCases?: TestCaseInput[]
}

interface QuestionFile {
  subject: SubjectType
  questions: QuestionInput[]
}

// ---------- Helpers ----------

function makeSlug(subject: string, title: string): string {
  return `${subject}-${title}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const subjectCategoryMap: Record<SubjectType, SubjectCategory> = {
  react: SubjectCategory.frontend,
  node: SubjectCategory.backend,
  dsa: SubjectCategory.dsa,
  database: SubjectCategory.database,
  system_design: SubjectCategory.system_design
}

// ---------- Main Seed ----------

async function main() {

  const dataDir = path.join(process.cwd(), "prisma", "data", "questions")

  const files = fs
    .readdirSync(dataDir)
    .filter((file) => file.endsWith(".json"))

  for (const file of files) {

    const filePath = path.join(dataDir, file)
    const raw = fs.readFileSync(filePath, "utf8")

    const parsed: QuestionFile = JSON.parse(raw)

    const subjectType = parsed.subject

    const subject = await prisma.subject.upsert({
      where: { title: subjectType },
      update: {},
      create: {
        title: subjectType,
        categoty: subjectCategoryMap[subjectType]
      }
    })

    for (const q of parsed.questions) {

      const slug = makeSlug(subjectType, q.title)

      const question = await prisma.question.upsert({
        where: { slug },
        update: {
          description: q.description ?? null,
          difficulty: q.difficulty
        },
        create: {
          title: q.title,
          slug,
          description: q.description ?? null,
          difficulty: q.difficulty,
          type: q.type ?? QuestionType.theory,
          constraints: q.constraints ?? null,
          inputFormat: q.inputFormat ?? null,
          outputFormat: q.outputFormat ?? null,
          starterCode: q.starterCode ?? null,
          averageTime: q.averageTime ?? 7
        }
      })

      // ---------- Topics ----------

      for (const topicName of q.topics) {

        const topic = await prisma.topic.upsert({
          where: {
            name_subjectId: {
              name: topicName,
              subjectId: subject.id
            }
          },
          update: {},
          create: {
            name: topicName,
            subjectId: subject.id
          }
        })

        await prisma.questionTopic.upsert({
          where: {
            questionId_topicId: {
              questionId: question.id,
              topicId: topic.id
            }
          },
          update: {},
          create: {
            questionId: question.id,
            topicId: topic.id
          }
        })
      }

      // ---------- Companies ----------

      for (const companyName of q.companies) {

        const company = await prisma.company.upsert({
          where: { name: companyName },
          update: {},
          create: { name: companyName }
        })

        await prisma.questionCompany.upsert({
          where: {
            questionId_companyId: {
              questionId: question.id,
              companyId: company.id
            }
          },
          update: {},
          create: {
            questionId: question.id,
            companyId: company.id
          }
        })
      }

      // ---------- Test Cases ----------

      if (q.testCases && q.testCases.length > 0) {

        await prisma.testCase.deleteMany({
          where: { questionId: question.id }
        })

        for (const tc of q.testCases) {

          await prisma.testCase.create({
            data: {
              questionId: question.id,
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              isPublic: tc.isPublic ?? false
            }
          })
        }
      }

    }

  }

}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log("✅ Database seeded successfully")
  })
  .catch(async (error) => {
    console.error("❌ Seeding failed:", error)
    await prisma.$disconnect()
    process.exit(1)
  })