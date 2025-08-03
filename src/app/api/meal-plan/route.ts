import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user'
    const weekStartDate = searchParams.get('weekStartDate')

    if (!weekStartDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'weekStartDate is required'
        },
        { status: 400 }
      )
    }

    const startDate = new Date(weekStartDate)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)

    // 指定された週の献立を取得
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
          include: {
            ingredients: {
              include: {
                ingredient: true
              }
            }
          }
        },
        lunch: {
          include: {
            ingredients: {
              include: {
                ingredient: true
              }
            }
          }
        },
        dinner: {
          include: {
            ingredients: {
              include: {
                ingredient: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    // 週間献立情報も取得
    const weeklyMealPlan = await prisma.weeklyMealPlan.findFirst({
      where: {
        userId,
        weekStartDate: startDate
      }
    })

    // 日付でグループ化
    const plansByDate: Record<string, {
      date: string;
      breakfast: any;
      lunch: any;
      dinner: any;
      userRating?: number;
      notes?: string;
    }> = {}
    
    // 週の全ての日付を初期化
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const dateKey = date.toISOString().split('T')[0]
      plansByDate[dateKey] = {
        date: date.toISOString(),
        breakfast: null,
        lunch: null,
        dinner: null
      }
    }

    // 実際の献立データを配置
    mealPlans.forEach(plan => {
      const dateKey = plan.date.toISOString().split('T')[0]
      if (plansByDate[dateKey]) {
        plansByDate[dateKey] = {
          date: plan.date.toISOString(),
          breakfast: plan.breakfast,
          lunch: plan.lunch,
          dinner: plan.dinner,
          userRating: plan.userRating ?? undefined,
          notes: plan.notes ?? undefined
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        weekStartDate: startDate.toISOString(),
        weeklyPlanId: weeklyMealPlan?.id || null,
        plans: Object.values(plansByDate)
      }
    })

  } catch (error) {
    console.error('Error fetching meal plans:', error)
    return NextResponse.json(
      {
        success: false,
        error: '献立の取得に失敗しました'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = 'demo-user', date, mealType, recipeId, rating, notes } = body

    if (!date || !mealType) {
      return NextResponse.json(
        {
          success: false,
          error: 'date and mealType are required'
        },
        { status: 400 }
      )
    }

    const planDate = new Date(date)
    
    // 既存の献立を更新または作成
    const updateData: {
      breakfastId?: string | null;
      lunchId?: string | null;
      dinnerId?: string | null;
      userRating?: number;
      notes?: string;
    } = {}
    if (mealType === 'breakfast') updateData.breakfastId = recipeId
    if (mealType === 'lunch') updateData.lunchId = recipeId
    if (mealType === 'dinner') updateData.dinnerId = recipeId
    if (rating !== undefined) updateData.userRating = rating
    if (notes !== undefined) updateData.notes = notes

    const mealPlan = await prisma.mealPlan.upsert({
      where: {
        userId_date: {
          userId,
          date: planDate
        }
      },
      update: updateData,
      create: {
        userId,
        date: planDate,
        ...updateData
      }
    })

    return NextResponse.json({
      success: true,
      data: mealPlan,
      message: '献立が更新されました'
    })

  } catch (error) {
    console.error('Error updating meal plan:', error)
    return NextResponse.json(
      {
        success: false,
        error: '献立の更新に失敗しました'
      },
      { status: 500 }
    )
  }
}