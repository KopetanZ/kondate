import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      familySize,
      hasChildren,
      hasElderly,
      allowsCurryTwoDays,
      eatsBreakfastBread,
      eatsGranolaOrCereal,
      wantsRestDays,
      usesFrozenFoods,
      usesPreparedFoods,
      allergies
    } = body

    // 一旦固定ユーザーIDを使用（後でセッション管理を実装）
    const fixedUserId = userId || 'demo-user'

    // ユーザーが存在しない場合は作成
    await prisma.user.upsert({
      where: { id: fixedUserId },
      update: {},
      create: {
        id: fixedUserId,
        email: `${fixedUserId}@example.com`,
        name: 'Demo User'
      }
    })

    // ユーザー設定を保存
    const preferences = await prisma.userPreferences.upsert({
      where: { userId: fixedUserId },
      update: {
        familySize,
        hasChildren,
        hasElderly,
        allowsCurryTwoDays,
        eatsBreakfastBread,
        eatsGranolaOrCereal,
        wantsRestDays,
        usesFrozenFoods,
        usesPreparedFoods,
        allergies: JSON.stringify(allergies)
      },
      create: {
        userId: fixedUserId,
        familySize,
        hasChildren,
        hasElderly,
        allowsCurryTwoDays,
        eatsBreakfastBread,
        eatsGranolaOrCereal,
        wantsRestDays,
        usesFrozenFoods,
        usesPreparedFoods,
        allergies: JSON.stringify(allergies)
      }
    })

    return NextResponse.json({
      success: true,
      data: preferences,
      message: 'ユーザー設定が保存されました'
    })
  } catch (error) {
    console.error('Error saving user preferences:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'ユーザー設定の保存に失敗しました'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user'

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId }
    })

    if (!preferences) {
      return NextResponse.json({
        success: false,
        error: 'ユーザー設定が見つかりません'
      }, { status: 404 })
    }

    // JSONフィールドをパース
    const data = {
      ...preferences,
      allergies: JSON.parse(preferences.allergies)
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Error fetching user preferences:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'ユーザー設定の取得に失敗しました'
      },
      { status: 500 }
    )
  }
}