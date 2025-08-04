import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 データベース接続テスト開始')
    
    // データベース接続テスト
    const userCount = await prisma.user.count()
    const recipeCount = await prisma.recipe.count()
    
    console.log('✅ データベース接続成功')
    console.log(`👥 ユーザー数: ${userCount}`)
    console.log(`🍽️ レシピ数: ${recipeCount}`)
    
    return NextResponse.json({
      success: true,
      data: {
        userCount,
        recipeCount,
        connected: true
      },
      message: 'データベース接続正常'
    })
    
  } catch (error) {
    console.error('❌ データベース接続エラー:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'データベース接続に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        connected: false
      },
      { status: 500 }
    )
  }
}