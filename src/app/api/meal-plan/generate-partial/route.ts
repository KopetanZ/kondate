import { NextRequest, NextResponse } from 'next/server'
import { OptimizedMealGenerator } from '@/lib/optimized-meal-generator'

export const maxDuration = 10

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('🚀 部分的献立生成API開始')
    
    const body = await request.json()
    console.log('📝 リクエストボディ:', body)
    
    const {
      userId = 'demo-user',
      weekStartDate,
      mealType,
      considerSeasonality = true,
      avoidRecentMeals = true,
      recentMealsDays = 14
    } = body

    console.log('🔧 パラメータ:', { userId, weekStartDate, mealType, considerSeasonality, avoidRecentMeals, recentMealsDays })

    if (!weekStartDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'weekStartDate is required'
        },
        { status: 400 }
      )
    }

    if (!mealType || !['breakfast', 'lunch', 'dinner'].includes(mealType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid mealType (breakfast, lunch, dinner) is required'
        },
        { status: 400 }
      )
    }

    console.log('🏗️ OptimizedMealGeneratorインスタンスを作成中...')
    const generator = new OptimizedMealGenerator()
    console.log('✅ OptimizedMealGeneratorインスタンス作成完了')
    
    // 🚀 部分的な献立生成
    console.log(`📊 ${mealType}献立生成開始...`)
    const partialPlan = await generator.generatePartialMealPlan({
      userId,
      weekStartDate: new Date(weekStartDate),
      mealType: mealType as 'breakfast' | 'lunch' | 'dinner',
      considerSeasonality,
      avoidRecentMeals,
      recentMealsDays
    })

    console.log(`⚡ ${mealType}献立生成完了: ${partialPlan.totalTime}ms`)

    // 🚀 部分的な保存処理
    console.log('💾 部分保存処理開始...')
    await generator.savePartialMealPlan(userId, partialPlan)
    console.log('✅ 部分保存処理完了')

    const totalTime = Date.now() - startTime
    console.log(`🎉 API全体処理時間: ${totalTime}ms`)

    return NextResponse.json({
      success: true,
      data: {
        ...partialPlan,
        apiTotalTime: totalTime
      },
      message: `${mealType === 'breakfast' ? '朝食' : mealType === 'lunch' ? '昼食' : '夕食'}献立が生成されました`,
      performance: {
        generationTime: partialPlan.totalTime,
        totalTime,
        version: 'partial'
      }
    })

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error('❌ 部分的献立生成エラー:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: '部分的献立の生成に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        processingTime: totalTime,
        version: 'partial'
      },
      { status: 500 }
    )
  }
}