import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const result = await prisma.question.updateMany({
    data: {
      type: "theory"
    }
  })

  console.log(`✅ Updated ${result.count} questions to type = theory`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
