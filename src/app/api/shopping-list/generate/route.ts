import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { IngredientCategory } from '@prisma/client'

interface ShoppingListItem {
  ingredientId: string
  ingredientName: string
  category: IngredientCategory
  totalQuantity: number
  unit: string
  recipes: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = 'demo-user', weekStartDate, listName } = body

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
      }
    })

    // 食材を集約
    const ingredientMap = new Map<string, ShoppingListItem>()

    mealPlans.forEach(plan => {
      const recipes = [
        { recipe: plan.breakfast, name: plan.breakfast?.name },
        { recipe: plan.lunch, name: plan.lunch?.name },
        { recipe: plan.dinner, name: plan.dinner?.name }
      ].filter(r => r.recipe)

      recipes.forEach(({ recipe, name }) => {
        if (!recipe) return

        recipe.ingredients.forEach(recipeIngredient => {
          const ingredient = recipeIngredient.ingredient
          const key = ingredient.id

          if (ingredientMap.has(key)) {
            const existing = ingredientMap.get(key)!
            // 同じ単位の場合のみ数量を合計
            if (existing.unit === recipeIngredient.unit) {
              existing.totalQuantity += recipeIngredient.quantity
            } else {
              // 単位が異なる場合は別のアイテムとして扱う
              const newKey = `${key}_${recipeIngredient.unit}`
              ingredientMap.set(newKey, {
                ingredientId: ingredient.id,
                ingredientName: ingredient.name,
                category: ingredient.category,
                totalQuantity: recipeIngredient.quantity,
                unit: recipeIngredient.unit,
                recipes: [name!]
              })
              return
            }
            
            if (!existing.recipes.includes(name!)) {
              existing.recipes.push(name!)
            }
          } else {
            ingredientMap.set(key, {
              ingredientId: ingredient.id,
              ingredientName: ingredient.name,
              category: ingredient.category,
              totalQuantity: recipeIngredient.quantity,
              unit: recipeIngredient.unit,
              recipes: [name!]
            })
          }
        })
      })
    })

    // カテゴリ別にソート
    const categoryOrder: Record<IngredientCategory, number> = {
      vegetables: 1,
      fruits: 2,
      meat: 3,
      fish: 4,
      dairy: 5,
      grains: 6,
      legumes: 7,
      seasonings: 8,
      oils: 9,
      others: 10
    }

    const sortedItems = Array.from(ingredientMap.values()).sort((a, b) => {
      const categoryDiff = categoryOrder[a.category] - categoryOrder[b.category]
      if (categoryDiff !== 0) return categoryDiff
      return a.ingredientName.localeCompare(b.ingredientName, 'ja')
    })

    // 買い物リストを保存
    const shoppingList = await prisma.shoppingList.create({
      data: {
        userId,
        name: listName || `${startDate.getMonth() + 1}月${startDate.getDate()}日週の買い物リスト`,
        weekStartDate: startDate,
        isCompleted: false
      }
    })

    // 買い物アイテムを保存
    const shoppingItems = await Promise.all(
      sortedItems.map(item =>
        prisma.shoppingItem.create({
          data: {
            shoppingListId: shoppingList.id,
            ingredientId: item.ingredientId,
            quantity: item.totalQuantity,
            unit: item.unit,
            isPurchased: false,
            notes: `使用レシピ: ${item.recipes.join(', ')}`
          }
        })
      )
    )

    // 買い物リストと関連データを返す
    const result = await prisma.shoppingList.findUnique({
      where: { id: shoppingList.id },
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

    return NextResponse.json({
      success: true,
      data: result,
      message: '買い物リストが正常に生成されました'
    })

  } catch (error) {
    console.error('Error generating shopping list:', error)
    return NextResponse.json(
      {
        success: false,
        error: '買い物リストの生成に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}