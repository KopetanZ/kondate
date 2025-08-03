import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)

    const whereClause: Record<string, any> = {}

    // カテゴリフィルター
    if (category) {
      whereClause.category = category
    }

    // 検索フィルター
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } }
      ]
    }

    // タグフィルター（JSONフィールドの検索）
    if (tags && tags.length > 0) {
      const tagConditions = tags.map(tag => ({
        tags: { contains: tag, mode: 'insensitive' }
      }))
      whereClause.AND = tagConditions
    }

    const recipes = await prisma.recipe.findMany({
      where: whereClause,
      include: {
        ingredients: {
          include: {
            ingredient: true
          }
        }
      },
      orderBy: [
        { userRating: { sort: 'desc', nulls: 'last' } },
        { name: 'asc' }
      ]
    })

    // レスポンス用にデータを整形
    const formattedRecipes = recipes.map(recipe => {
      let tags: string[] = []
      let nutrition = { calories: 0, protein: 0, fat: 0, carbs: 0 }

      try {
        tags = typeof recipe.tags === 'string' ? JSON.parse(recipe.tags) : recipe.tags || []
      } catch {
        tags = []
      }

      try {
        nutrition = typeof recipe.nutrition === 'string' ? JSON.parse(recipe.nutrition) : recipe.nutrition || nutrition
      } catch {
        nutrition = { calories: 0, protein: 0, fat: 0, carbs: 0 }
      }

      return {
        id: recipe.id,
        name: recipe.name,
        category: recipe.category,
        cookingTime: recipe.cookingTime,
        difficulty: recipe.difficulty,
        servings: recipe.servings,
        tags,
        nutrition,
        userRating: recipe.userRating,
        familyRating: recipe.familyRating,
        ingredients: recipe.ingredients.map(ri => ({
          name: ri.ingredient.name,
          quantity: ri.quantity,
          unit: ri.unit
        }))
      }
    })

    return NextResponse.json({
      success: true,
      recipes: formattedRecipes,
      total: formattedRecipes.length
    })

  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'レシピの取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}