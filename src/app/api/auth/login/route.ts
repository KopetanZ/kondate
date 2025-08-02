import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { familyName, password } = await request.json()

    if (!familyName || !password) {
      return NextResponse.json(
        { error: 'familyName and password are required' },
        { status: 400 }
      )
    }

    // ユーザーを検索
    const user = await prisma.user.findUnique({
      where: { familyName }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    // パスワード（絵4つ）を検証
    const storedPassword = JSON.parse(user.password)
    if (JSON.stringify(password) !== JSON.stringify(storedPassword)) {
      return NextResponse.json(
        { error: 'パスワードが間違っています' },
        { status: 401 }
      )
    }

    // ログイン成功
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        familyName: user.familyName,
        familyIcon: user.familyIcon
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}