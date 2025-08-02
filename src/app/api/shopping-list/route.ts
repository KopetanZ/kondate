import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user'
    const listId = searchParams.get('listId')

    if (listId) {
      // 特定の買い物リストを取得
      const shoppingList = await prisma.shoppingList.findUnique({
        where: { id: listId },
        include: {
          items: {
            include: {
              ingredient: true
            },
            orderBy: [
              { ingredient: { category: 'asc' } },
              { ingredient: { name: 'asc' } }
            ]
          }
        }
      })

      if (!shoppingList) {
        return NextResponse.json(
          {
            success: false,
            error: '買い物リストが見つかりません'
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: shoppingList
      })
    } else {
      // ユーザーの全ての買い物リストを取得
      const shoppingLists = await prisma.shoppingList.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              ingredient: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return NextResponse.json({
        success: true,
        data: shoppingLists
      })
    }

  } catch (error) {
    console.error('Error fetching shopping lists:', error)
    return NextResponse.json(
      {
        success: false,
        error: '買い物リストの取得に失敗しました'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { listId, itemId, isPurchased, actualPrice, notes } = body

    if (itemId) {
      // 特定のアイテムを更新
      const updatedItem = await prisma.shoppingItem.update({
        where: { id: itemId },
        data: {
          ...(isPurchased !== undefined && { isPurchased }),
          ...(actualPrice !== undefined && { actualPrice }),
          ...(notes !== undefined && { notes })
        }
      })

      return NextResponse.json({
        success: true,
        data: updatedItem,
        message: 'アイテムが更新されました'
      })
    } else if (listId) {
      // リスト全体を更新（完了状態など）
      const { isCompleted } = body
      
      const updatedList = await prisma.shoppingList.update({
        where: { id: listId },
        data: {
          ...(isCompleted !== undefined && { isCompleted })
        }
      })

      return NextResponse.json({
        success: true,
        data: updatedList,
        message: '買い物リストが更新されました'
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: 'listId または itemId が必要です'
      },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error updating shopping list:', error)
    return NextResponse.json(
      {
        success: false,
        error: '買い物リストの更新に失敗しました'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const listId = searchParams.get('listId')

    if (!listId) {
      return NextResponse.json(
        {
          success: false,
          error: 'listId is required'
        },
        { status: 400 }
      )
    }

    // 関連するアイテムも一緒に削除される（CASCADE設定による）
    await prisma.shoppingList.delete({
      where: { id: listId }
    })

    return NextResponse.json({
      success: true,
      message: '買い物リストが削除されました'
    })

  } catch (error) {
    console.error('Error deleting shopping list:', error)
    return NextResponse.json(
      {
        success: false,
        error: '買い物リストの削除に失敗しました'
      },
      { status: 500 }
    )
  }
}