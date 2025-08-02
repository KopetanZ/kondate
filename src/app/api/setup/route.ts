import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    console.log('Database setup starting...')
    
    // まずデータベース接続をテスト
    await prisma.$connect()
    console.log('Database connection successful')
    
    // データベーススキーマが存在するかチェック
    try {
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
    } catch (tableError) {
      console.error('Tables do not exist, schema needs to be created')
      return NextResponse.json({
        success: false,
        error: 'Database schema not initialized. Please run database migrations.',
        details: tableError instanceof Error ? tableError.message : 'Table access error',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Database setup failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// GET method for checking database status
export async function GET(request: NextRequest) {
  try {
    await prisma.$connect()
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      success: true,
      initialized: userCount > 0,
      userCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      initialized: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}