import { NextRequest, NextResponse } from 'next/server'
import { MealGenerator } from '@/lib/meal-generator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId = 'demo-user',
      weekStartDate,
      considerSeasonality = true,
      avoidRecentMeals = true,
      recentMealsDays = 14,
      includeVariety = true,
      maxSameCategoryPerWeek = 2
    } = body

    if (!weekStartDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'weekStartDate is required'
        },
        { status: 400 }
      )
    }

    const generator = new MealGenerator()
    const weeklyPlan = await generator.generateWeeklyMealPlan({
      userId,
      weekStartDate: new Date(weekStartDate),
      considerSeasonality,
      avoidRecentMeals,
      recentMealsDays,
      includeVariety,
      maxSameCategoryPerWeek
    })

    // 生成した献立をデータベースに保存
    const savedPlan = await generator.saveMealPlan(userId, weeklyPlan)

    return NextResponse.json({
      success: true,
      data: {
        ...weeklyPlan,
        id: savedPlan.id
      },
      message: '週間献立が正常に生成されました'
    })

  } catch (error) {
    console.error('Error generating meal plan:', error)
    return NextResponse.json(
      {
        success: false,
        error: '献立の生成に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}