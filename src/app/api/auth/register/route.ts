import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { familyName, familyIcon, password } = await request.json()

    if (!familyName || !familyIcon || !password || !Array.isArray(password) || password.length !== 4) {
      return NextResponse.json(
        { error: '家族名、アイコン、4つの絵のパスワードが必要です' },
        { status: 400 }
      )
    }

    // 既存ユーザーをチェック
    const existingUser = await prisma.user.findUnique({
      where: { familyName }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'この家族名は既に使用されています' },
        { status: 409 }
      )
    }

    // 新しいユーザーを作成
    const user = await prisma.user.create({
      data: {
        familyName,
        familyIcon,
        password: JSON.stringify(password)
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        familyName: user.familyName,
        familyIcon: user.familyIcon
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      familyName,
      familyIcon,
      passwordLength: password?.length
    })
    return NextResponse.json(
      { 
        error: 'サーバーエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}