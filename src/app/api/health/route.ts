import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('Health check starting...')
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('DATABASE_URL preview:', process.env.DATABASE_URL?.substring(0, 20) + '...')
    
    // データベース接続テスト
    await prisma.$connect()
    console.log('Database connection successful')
    
    // テーブル存在確認
    try {
      const userCount = await prisma.user.count()
      console.log('User table exists, count:', userCount)
      
      return NextResponse.json({
        success: true,
        database: 'connected',
        userCount,
        timestamp: new Date().toISOString()
      })
    } catch (tableError) {
      console.error('Table access error:', tableError)
      
      return NextResponse.json({
        success: false,
        database: 'connected_but_no_tables',
        error: tableError instanceof Error ? tableError.message : 'Unknown table error',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      success: false,
      database: 'connection_failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}