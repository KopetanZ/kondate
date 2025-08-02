import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('Health check starting...')
    
    // 基本的な情報
    const basicInfo = {
      success: true,
      message: 'API is working',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      databaseUrl: !!process.env.DATABASE_URL ? 'configured' : 'missing'
    }
    
    // データベース接続テスト
    try {
      console.log('Testing database connection...')
      await prisma.$connect()
      console.log('Database connection successful')
      
      // テーブル存在確認
      try {
        const userCount = await prisma.user.count()
        console.log('User table exists, count:', userCount)
        
        return NextResponse.json({
          ...basicInfo,
          database: {
            status: 'connected',
            userCount,
            tablesExist: true
          }
        })
      } catch (tableError) {
        console.error('Table access error:', tableError)
        
        return NextResponse.json({
          ...basicInfo,
          database: {
            status: 'connected_but_no_tables',
            error: tableError instanceof Error ? tableError.message : 'Unknown table error',
            tablesExist: false
          }
        })
      }
      
    } catch (dbError) {
      console.error('Database connection failed:', dbError)
      
      return NextResponse.json({
        ...basicInfo,
        database: {
          status: 'connection_failed',
          error: dbError instanceof Error ? dbError.message : 'Unknown database error'
        }
      })
    } finally {
      await prisma.$disconnect()
    }
    
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}