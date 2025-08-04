import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface NutritionData {
  calories: number
  protein: number
  fat: number
  carbohydrates: number
  fiber: number
  sodium: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const weekStartDate = searchParams.get('weekStartDate')

    if (!userId || !weekStartDate) {
      return NextResponse.json(
        { success: false, error: 'userId and weekStartDate are required' },
        { status: 400 }
      )
    }

    console.log('🍎 週間栄養バランス分析開始:', { userId, weekStartDate })

    const startDate = new Date(weekStartDate)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)

    // 指定週の献立データを取得
    const mealPlans = await prisma.mealPlan.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        breakfast: {
          select: {
            id: true,
            name: true,
            nutrition: true
          }
        },
        lunch: {
          select: {
            id: true,
            name: true,
            nutrition: true
          }
        },
        dinner: {
          select: {
            id: true,
            name: true,
            nutrition: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    console.log(`📊 献立データ取得完了: ${mealPlans.length}日分`)

    // ユーザーの栄養目標を取得または作成
    let nutritionTarget = await prisma.nutritionTarget.findUnique({
      where: { userId }
    })

    if (!nutritionTarget) {
      // デフォルトの栄養目標を作成（成人男性の推奨値）
      nutritionTarget = await prisma.nutritionTarget.create({
        data: {
          userId,
          dailyCalories: 2200,
          dailyProtein: 65,
          dailyFat: 60,
          dailyCarbohydrates: 320,
          dailyFiber: 20,
          dailySodium: 7500 // mg
        }
      })
      console.log('✅ デフォルト栄養目標を作成')
    }

    // 日別栄養データを計算
    const dailyNutrition: Array<{
      date: string
      nutrition: NutritionData
    }> = []

    for (const plan of mealPlans) {
      const dayNutrition: NutritionData = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0,
        fiber: 0,
        sodium: 0
      }

      // 各食事の栄養を集計
      const meals = [plan.breakfast, plan.lunch, plan.dinner].filter(Boolean)
      
      for (const meal of meals) {
        if (meal?.nutrition) {
          try {
            const nutrition = JSON.parse(meal.nutrition)
            dayNutrition.calories += nutrition.calories || 0
            dayNutrition.protein += nutrition.protein || 0
            dayNutrition.fat += nutrition.fat || 0
            dayNutrition.carbohydrates += nutrition.carbohydrates || nutrition.carbs || 0
            dayNutrition.fiber += nutrition.fiber || 0
            dayNutrition.sodium += nutrition.sodium || 0
          } catch (error) {
            console.warn(`栄養データの解析に失敗: ${meal.name}`, error)
          }
        }
      }

      dailyNutrition.push({
        date: plan.date.toISOString(),
        nutrition: dayNutrition
      })
    }

    // 週間合計と平均を計算
    const weeklyTotal: NutritionData = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0,
      fiber: 0,
      sodium: 0
    }

    for (const day of dailyNutrition) {
      weeklyTotal.calories += day.nutrition.calories
      weeklyTotal.protein += day.nutrition.protein
      weeklyTotal.fat += day.nutrition.fat
      weeklyTotal.carbohydrates += day.nutrition.carbohydrates
      weeklyTotal.fiber += day.nutrition.fiber
      weeklyTotal.sodium += day.nutrition.sodium
    }

    const daysCount = dailyNutrition.length || 1
    const weeklyAverage: NutritionData = {
      calories: weeklyTotal.calories / daysCount,
      protein: weeklyTotal.protein / daysCount,
      fat: weeklyTotal.fat / daysCount,
      carbohydrates: weeklyTotal.carbohydrates / daysCount,
      fiber: weeklyTotal.fiber / daysCount,
      sodium: weeklyTotal.sodium / daysCount
    }

    console.log('📈 栄養分析完了:', {
      日数: daysCount,
      平均カロリー: Math.round(weeklyAverage.calories),
      平均タンパク質: Math.round(weeklyAverage.protein * 10) / 10
    })

    const result = {
      daily: dailyNutrition,
      weeklyTotal,
      weeklyAverage,
      target: {
        dailyCalories: nutritionTarget.dailyCalories,
        dailyProtein: nutritionTarget.dailyProtein,
        dailyFat: nutritionTarget.dailyFat,
        dailyCarbohydrates: nutritionTarget.dailyCarbohydrates,
        dailyFiber: nutritionTarget.dailyFiber,
        dailySodium: nutritionTarget.dailySodium
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: '栄養バランス分析が完了しました'
    })

  } catch (error) {
    console.error('❌ 栄養バランス分析エラー:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: '栄養バランス分析に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}