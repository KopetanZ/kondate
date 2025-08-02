import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Health check starting...')
    
    // 基本的な情報を返す
    return NextResponse.json({
      success: true,
      message: 'API is working',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      databaseUrl: !!process.env.DATABASE_URL ? 'configured' : 'missing'
    })
    
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}