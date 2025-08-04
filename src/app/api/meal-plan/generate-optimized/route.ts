import { NextRequest, NextResponse } from 'next/server'
import { OptimizedMealGenerator } from '@/lib/optimized-meal-generator'

// Vercel向け最適化設定
export const maxDuration = 10 // Hobby planの制限に合わせて10秒

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('🚀 最適化献立生成API開始')
    
    const body = await request.json()
    console.log('📝 リクエストボディ:', body)
    
    const {
      userId = 'demo-user',
      weekStartDate,
      considerSeasonality = true,
      avoidRecentMeals = true,
      recentMealsDays = 14
    } = body

    console.log('🔧 パラメータ:', { userId, weekStartDate, considerSeasonality, avoidRecentMeals, recentMealsDays })

    if (!weekStartDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'weekStartDate is required'
        },
        { status: 400 }
      )
    }

    console.log('🏗️ OptimizedMealGeneratorインスタンスを作成中...')
    const generator = new OptimizedMealGenerator()
    console.log('✅ OptimizedMealGeneratorインスタンス作成完了')
    
    // 🚀 最適化された献立生成
    console.log('📊 献立生成開始...')
    const weeklyPlan = await generator.generateWeeklyMealPlanOptimized({
      userId,
      weekStartDate: new Date(weekStartDate),
      considerSeasonality,
      avoidRecentMeals,
      recentMealsDays
    })

    console.log(`⚡ 献立生成完了: ${weeklyPlan.totalTime}ms`)

    // 🚀 最適化された保存処理
    console.log('💾 保存処理開始...')
    await generator.saveMealPlanOptimized(userId, weeklyPlan)
    console.log('✅ 保存処理完了')

    const totalTime = Date.now() - startTime
    console.log(`🎉 API全体処理時間: ${totalTime}ms`)

    return NextResponse.json({
      success: true,
      data: {
        ...weeklyPlan,
        apiTotalTime: totalTime
      },
      message: '週間献立が高速生成されました',
      performance: {
        generationTime: weeklyPlan.totalTime,
        totalTime,
        version: 'optimized'
      }
    })

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error('❌ 最適化献立生成エラー:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: '献立の生成に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        processingTime: totalTime,
        version: 'optimized'
      },
      { status: 500 }
    )
  }
}