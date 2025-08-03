import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        familyName: true,
        familyIcon: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      users
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}