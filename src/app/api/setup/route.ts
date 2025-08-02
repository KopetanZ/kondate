import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    console.log('Database setup starting...')
    
    // 既存のサンプルユーザーが存在するかチェック
    const existingUsers = await prisma.user.findMany()
    console.log('Existing users count:', existingUsers.length)
    
    if (existingUsers.length === 0) {
      // サンプルユーザーを作成
      const sampleUsers = [
        {
          familyName: '田中家',
          familyIcon: '🏠',
          password: JSON.stringify(['🍎', '🍌', '🍊', '🍇'])
        },
        {
          familyName: '佐藤家',
          familyIcon: '🏡',
          password: JSON.stringify(['🍖', '🐟', '🍳', '🧀'])
        },
        {
          familyName: '鈴木家', 
          familyIcon: '🌟',
          password: JSON.stringify(['⚽', '🎾', '🏀', '🎱'])
        }
      ]

      for (const userData of sampleUsers) {
        const user = await prisma.user.create({
          data: userData
        })
        console.log(`Created user: ${userData.familyName}`)
      }
      
      return NextResponse.json({
        success: true,
        message: 'Database setup completed',
        usersCreated: sampleUsers.length,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: true,
        message: 'Database already initialized',
        existingUsers: existingUsers.length,
        timestamp: new Date().toISOString()
      })
    }
    
  } catch (error) {
    console.error('Database setup failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}