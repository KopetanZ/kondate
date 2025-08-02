import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // サンプルユーザーを作成
  const sampleUsers = [
    {
      familyName: '田中家',
      familyIcon: '🏠',
      password: JSON.stringify(['🍎', '🍌', '🍊', '🍇']) // りんご、バナナ、オレンジ、ぶどう
    },
    {
      familyName: '佐藤家',
      familyIcon: '🏡',
      password: JSON.stringify(['🍖', '🐟', '🍳', '🧀']) // 肉、魚、卵、チーズ
    },
    {
      familyName: '鈴木家', 
      familyIcon: '🌟',
      password: JSON.stringify(['⚽', '🎾', '🏀', '🎱']) // サッカー、テニス、バスケ、ビリヤード
    }
  ]

  for (const userData of sampleUsers) {
    await prisma.user.upsert({
      where: { familyName: userData.familyName },
      update: {},
      create: userData
    })
    
    console.log(`Created user: ${userData.familyName}`)
  }

  console.log('Sample users created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })