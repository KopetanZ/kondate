import { NextRequest, NextResponse } from 'next/server'
import { MealGenerator } from '@/lib/meal-generator'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('🚀 单日献立生成デバッグ開始')
    
    const body = await request.json()
    console.log('📝 リクエストデータ:', body)
    
    const {
      userId = 'demo-user',
      targetDate,
      considerSeasonality = true,
      avoidRecentMeals = true
    } = body

    if (!targetDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'targetDate is required'
        },
        { status: 400 }
      )
    }

    const generator = new MealGenerator()
    console.log('⚙️ MealGeneratorインスタンス作成完了')

    // ユーザー設定を取得
    console.log('👤 ユーザー設定を取得中...')
    const preferences = await (generator as any).getUserPreferences(userId)
    console.log('✅ ユーザー設定:', preferences)

    // 現在の季節を取得
    const currentSeason = (generator as any).getCurrentSeason()
    console.log('🌸 現在の季節:', currentSeason)

    // 最近の献立IDを取得
    console.log('📋 最近の献立履歴を取得中...')
    const recentRecipeIds = avoidRecentMeals ? 
      await (generator as any).getRecentMealPlanIds(userId, 14) : []
    console.log('✅ 最近使用したレシピID:', recentRecipeIds)

    // 各食事のレシピを取得
    const meals = ['breakfast', 'lunch', 'dinner']
    const dayPlan: any = {
      date: targetDate,
      breakfast: null,
      lunch: null,
      dinner: null,
      debug: {
        preferences,
        currentSeason,
        recentRecipeIds,
        timings: {}
      }
    }

    for (const mealType of meals) {
      const mealStartTime = Date.now()
      console.log(`🍽️ ${mealType}のレシピを取得中...`)

      try {
        // レシピを取得（MealTypeは小文字のenum）
        const recipes = await (generator as any).getFilteredRecipes({
          mealType: mealType, // 小文字のまま渡す
          season: considerSeasonality ? currentSeason : undefined,
          allergies: preferences.allergies,
          excludeRecipeIds: recentRecipeIds
        })

        console.log(`📊 ${mealType}の利用可能レシピ数: ${recipes.length}`)
        
        if (recipes.length > 0) {
          // ランダム選択
          const selectedRecipe = (generator as any).selectRandomRecipe(recipes)
          dayPlan[mealType] = selectedRecipe
          console.log(`✅ ${mealType}選択完了: ${selectedRecipe?.name}`)
        } else {
          console.log(`⚠️ ${mealType}のレシピが見つかりません`)
          
          // フォールバック: 条件を緩和して再試行
          console.log(`🔄 ${mealType}のフォールバック処理開始`)
          const fallbackRecipes = await (generator as any).getFilteredRecipes({
            mealType: mealType, // 小文字のまま渡す
            allergies: preferences.allergies,
            excludeRecipeIds: []
          })
          
          if (fallbackRecipes.length > 0) {
            const fallbackRecipe = (generator as any).selectRandomRecipe(fallbackRecipes)
            dayPlan[mealType] = fallbackRecipe
            console.log(`✅ ${mealType}フォールバック成功: ${fallbackRecipe?.name}`)
          } else {
            console.log(`❌ ${mealType}のフォールバックも失敗`)
            dayPlan[mealType] = {
              id: `fallback-${mealType}`,
              name: `簡単${mealType === 'breakfast' ? '朝食' : mealType === 'lunch' ? '昼食' : '夕食'}`,
              isFallback: true
            }
          }
        }

        dayPlan.debug.timings[mealType] = Date.now() - mealStartTime
      } catch (mealError) {
        console.error(`❌ ${mealType}生成エラー:`, mealError)
        dayPlan[mealType] = {
          id: `error-${mealType}`,
          name: `エラー: ${mealType}`,
          error: mealError instanceof Error ? mealError.message : 'Unknown error'
        }
      }
    }

    const totalTime = Date.now() - startTime
    dayPlan.debug.totalTime = totalTime

    console.log('🎉 単日献立生成完了')
    console.log('⏱️ 総処理時間:', totalTime, 'ms')
    console.log('📋 生成結果:', dayPlan)

    return NextResponse.json({
      success: true,
      data: dayPlan,
      processingTime: totalTime
    })

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error('❌ 単日献立生成エラー:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: '単日献立の生成に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        processingTime: totalTime
      },
      { status: 500 }
    )
  }
}