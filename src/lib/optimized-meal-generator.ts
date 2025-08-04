import { prisma } from './db'
import { MealType, Season } from '@prisma/client'

export interface MealGenerationOptions {
  userId: string
  weekStartDate: Date
  considerSeasonality?: boolean
  avoidRecentMeals?: boolean
  recentMealsDays?: number
}

export interface PartialMealGenerationOptions {
  userId: string
  weekStartDate: Date
  mealType: 'breakfast' | 'lunch' | 'dinner'
  considerSeasonality?: boolean
  avoidRecentMeals?: boolean
  recentMealsDays?: number
}

export class OptimizedMealGenerator {
  private async getUserPreferences(userId: string) {
    let preferences = await prisma.userPreferences.findUnique({
      where: { userId }
    })
    
    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: {
          userId,
          familySize: 2,
          hasChildren: false,
          hasElderly: false,
          allowsCurryTwoDays: true,
          eatsBreakfastBread: true,
          eatsGranolaOrCereal: false,
          wantsRestDays: true,
          usesFrozenFoods: true,
          usesPreparedFoods: true,
          allergies: JSON.stringify([])
        }
      })
    }
    
    return {
      ...preferences,
      allergies: JSON.parse(preferences.allergies)
    }
  }

  private getCurrentSeason(): Season {
    const month = new Date().getMonth() + 1
    if (month >= 3 && month <= 5) return Season.spring
    if (month >= 6 && month <= 8) return Season.summer
    if (month >= 9 && month <= 11) return Season.autumn
    return Season.winter
  }

  // 🚀 最適化: 全レシピを一度に取得してメモリ内でフィルタリング
  private async getAllRecipesOptimized() {
    const recipes = await prisma.recipe.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        cookingTime: true,
        difficulty: true,
        servings: true,
        tags: true,
        nutrition: true,
        ingredients: {
          select: {
            ingredient: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    // メモリ内でカテゴリ別に分類
    const categorizedRecipes = {
      breakfast: recipes.filter(r => r.category === MealType.breakfast),
      lunch: recipes.filter(r => r.category === MealType.lunch),
      dinner: recipes.filter(r => r.category === MealType.dinner)
    }

    return { recipes, categorizedRecipes }
  }

  // 🚀 最適化: 最近の献立を一度のクエリで取得
  private async getRecentMealPlanIds(userId: string, days: number) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const recentPlans = await prisma.mealPlan.findMany({
      where: {
        userId,
        date: { gte: cutoffDate }
      },
      select: {
        breakfastId: true,
        lunchId: true,
        dinnerId: true
      }
    })

    const usedRecipeIds = new Set<string>()
    recentPlans.forEach(plan => {
      if (plan.breakfastId) usedRecipeIds.add(plan.breakfastId)
      if (plan.lunchId) usedRecipeIds.add(plan.lunchId)
      if (plan.dinnerId) usedRecipeIds.add(plan.dinnerId)
    })

    return Array.from(usedRecipeIds)
  }

  // 🚀 最適化: メモリ内フィルタリング
  private filterRecipesInMemory(
    recipes: any[], 
    allergies: string[], 
    excludeIds: string[] = []
  ) {
    return recipes.filter(recipe => {
      // 除外IDチェック
      if (excludeIds.includes(recipe.id)) return false
      
      // アレルギーチェック
      const recipeIngredients = recipe.ingredients.map((ri: any) => ri.ingredient.name)
      const hasAllergen = allergies.some(allergy => 
        recipeIngredients.some((ingredient: string) => 
          ingredient.toLowerCase().includes(allergy.toLowerCase())
        )
      )
      
      return !hasAllergen
    })
  }

  private selectRandomRecipe(recipes: any[], usedIds: Set<string> = new Set()) {
    const availableRecipes = recipes.filter(recipe => !usedIds.has(recipe.id))
    if (availableRecipes.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * availableRecipes.length)
    return availableRecipes[randomIndex]
  }

  // 有効なレシピIDかどうかをチェック（フォールバックや一時的IDを除外）
  private isValidRecipeId(recipeId: string | undefined): boolean {
    if (!recipeId) return false
    
    // フォールバックIDや一時的IDを除外
    if (recipeId.startsWith('fallback-') || 
        recipeId.startsWith('error-') || 
        recipeId.startsWith('rest-day-')) {
      return false
    }
    
    return true
  }

  async generateWeeklyMealPlanOptimized(options: MealGenerationOptions): Promise<any> {
    const startTime = Date.now()
    console.log('🚀 最適化された献立生成開始')
    console.log('📋 オプション:', options)

    const {
      userId,
      weekStartDate,
      considerSeasonality = true,
      avoidRecentMeals = true,
      recentMealsDays = 14
    } = options

    try {
      // 🚀 並列処理: ユーザー設定・レシピ・履歴を同時取得
      console.log('📊 データ取得開始...')
      console.log('👤 ユーザー設定取得中...')
      console.log('🍽️ レシピデータ取得中...')
      console.log('📜 履歴データ取得中...')
      
      const [preferences, recipesData, recentRecipeIds] = await Promise.all([
        this.getUserPreferences(userId),
        this.getAllRecipesOptimized(),
        avoidRecentMeals ? this.getRecentMealPlanIds(userId, recentMealsDays) : Promise.resolve([])
      ])
      
      console.log('✅ ユーザー設定:', preferences)
      console.log('✅ レシピ数:', recipesData.recipes.length)
      console.log('✅ 最近使用レシピID数:', recentRecipeIds.length)

      console.log(`📊 データ取得完了: ${Date.now() - startTime}ms`)

      const { categorizedRecipes } = recipesData
      
      // メモリ内でフィルタリング
      const filteredRecipes = {
        breakfast: this.filterRecipesInMemory(categorizedRecipes.breakfast, preferences.allergies, recentRecipeIds),
        lunch: this.filterRecipesInMemory(categorizedRecipes.lunch, preferences.allergies, recentRecipeIds),
        dinner: this.filterRecipesInMemory(categorizedRecipes.dinner, preferences.allergies, recentRecipeIds)
      }

      console.log(`🔍 フィルタリング完了: 朝食${filteredRecipes.breakfast.length}件, 昼食${filteredRecipes.lunch.length}件, 夕食${filteredRecipes.dinner.length}件`)

      // 週の日付を生成
      const weekDates = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStartDate)
        date.setDate(weekStartDate.getDate() + i)
        weekDates.push(date)
      }

      const generatedPlans: any[] = []
      const usedRecipeIds = new Set<string>()

      // 🚀 高速生成: メモリ内データで各日の献立を生成
      for (let dayIndex = 0; dayIndex < weekDates.length; dayIndex++) {
        const date = weekDates[dayIndex]
        const dayPlan: any = {
          date,
          breakfast: null,
          lunch: null,
          dinner: null
        }

        // 朝食生成
        if (preferences.eatsBreakfastBread || preferences.eatsGranolaOrCereal) {
          const breakfast = this.selectRandomRecipe(filteredRecipes.breakfast, usedRecipeIds)
          if (breakfast) {
            dayPlan.breakfast = breakfast
            usedRecipeIds.add(breakfast.id)
          }
        }

        // 昼食生成
        let lunchCandidates = filteredRecipes.lunch
        if (lunchCandidates.length === 0) {
          lunchCandidates = filteredRecipes.dinner
        }
        
        const lunch = this.selectRandomRecipe(lunchCandidates, usedRecipeIds)
        if (lunch) {
          dayPlan.lunch = lunch
          usedRecipeIds.add(lunch.id)
        }

        // 夕食生成
        const dinner = this.selectRandomRecipe(filteredRecipes.dinner, usedRecipeIds)
        if (dinner) {
          dayPlan.dinner = dinner
          usedRecipeIds.add(dinner.id)
        } else {
          // フォールバック
          dayPlan.dinner = {
            id: `fallback-dinner-${dayIndex}`,
            name: '簡単炒め物',
            category: 'dinner',
            isFallback: true,
            cookingTime: 15,
            difficulty: 1,
            servings: preferences.familySize
          }
        }

        generatedPlans.push(dayPlan)
      }

      console.log(`⚡ 献立生成完了: ${Date.now() - startTime}ms`)

      // 休憩日の処理
      if (preferences.wantsRestDays) {
        const restDayIndex = Math.floor(Math.random() * 7)
        generatedPlans[restDayIndex].dinner = {
          id: `rest-day-${restDayIndex}`,
          name: preferences.usesFrozenFoods ? '冷凍餃子' : 'お惣菜',
          isRestDay: true,
          cookingTime: 5,
          difficulty: 1
        }
      }

      const result = {
        weekStartDate,
        plans: generatedPlans,
        generatedAt: new Date(),
        totalTime: Date.now() - startTime,
        settings: {
          considerSeasonality,
          avoidRecentMeals,
          recentMealsDays
        }
      }

      console.log(`🎉 献立生成完了: 総処理時間 ${result.totalTime}ms`)
      return result

    } catch (error) {
      console.error('❌ 最適化献立生成エラー:', error)
      throw error
    }
  }

  // 🚀 部分的な献立生成（朝食のみ、夕食のみなど）
  async generatePartialMealPlan(options: PartialMealGenerationOptions): Promise<any> {
    const startTime = Date.now()
    console.log(`🚀 ${options.mealType}のみの献立生成開始`)
    console.log('📋 オプション:', options)

    const {
      userId,
      weekStartDate,
      mealType,
      considerSeasonality = true,
      avoidRecentMeals = true,
      recentMealsDays = 14
    } = options

    try {
      // 🚀 並列処理: ユーザー設定・レシピ・履歴を同時取得
      console.log('📊 データ取得開始...')
      
      const [preferences, recipesData, recentRecipeIds] = await Promise.all([
        this.getUserPreferences(userId),
        this.getAllRecipesOptimized(),
        avoidRecentMeals ? this.getRecentMealPlanIds(userId, recentMealsDays) : Promise.resolve([])
      ])
      
      console.log('✅ ユーザー設定:', preferences)
      console.log('✅ レシピ数:', recipesData.recipes.length)
      console.log('✅ 最近使用レシピID数:', recentRecipeIds.length)

      console.log(`📊 データ取得完了: ${Date.now() - startTime}ms`)

      const { categorizedRecipes } = recipesData
      
      // メモリ内でフィルタリング（指定された食事タイプのみ）
      const filteredRecipes = this.filterRecipesInMemory(
        categorizedRecipes[mealType], 
        preferences.allergies, 
        recentRecipeIds
      )

      console.log(`🔍 ${mealType}フィルタリング完了: ${filteredRecipes.length}件`)

      // 週の日付を生成
      const weekDates = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStartDate)
        date.setDate(weekStartDate.getDate() + i)
        weekDates.push(date)
      }

      const generatedPlans: any[] = []
      const usedRecipeIds = new Set<string>()

      // 🚀 高速生成: 指定された食事タイプのみ生成
      for (let dayIndex = 0; dayIndex < weekDates.length; dayIndex++) {
        const date = weekDates[dayIndex]
        
        let selectedRecipe = null

        // 食事タイプに応じてレシピを選択
        if (mealType === 'breakfast' && (preferences.eatsBreakfastBread || preferences.eatsGranolaOrCereal)) {
          selectedRecipe = this.selectRandomRecipe(filteredRecipes, usedRecipeIds)
        } else if (mealType === 'lunch') {
          // 昼食候補がない場合は夕食レシピからも選択
          let lunchCandidates = filteredRecipes
          if (lunchCandidates.length === 0) {
            const dinnerRecipes = this.filterRecipesInMemory(
              categorizedRecipes.dinner, 
              preferences.allergies, 
              recentRecipeIds
            )
            lunchCandidates = dinnerRecipes
          }
          selectedRecipe = this.selectRandomRecipe(lunchCandidates, usedRecipeIds)
        } else if (mealType === 'dinner') {
          selectedRecipe = this.selectRandomRecipe(filteredRecipes, usedRecipeIds)
        }

        if (selectedRecipe) {
          usedRecipeIds.add(selectedRecipe.id)
        }

        // 休憩日の処理（夕食のみの場合）
        if (mealType === 'dinner' && preferences.wantsRestDays && dayIndex === Math.floor(Math.random() * 7)) {
          selectedRecipe = {
            id: `rest-day-${dayIndex}`,
            name: preferences.usesFrozenFoods ? '冷凍餃子' : 'お惣菜',
            isRestDay: true,
            cookingTime: 5,
            difficulty: 1
          }
        }

        generatedPlans.push({
          date,
          [mealType]: selectedRecipe
        })
      }

      console.log(`⚡ ${mealType}献立生成完了: ${Date.now() - startTime}ms`)

      const result = {
        weekStartDate,
        mealType,
        plans: generatedPlans,
        generatedAt: new Date(),
        totalTime: Date.now() - startTime,
        settings: {
          considerSeasonality,
          avoidRecentMeals,
          recentMealsDays
        }
      }

      console.log(`🎉 ${mealType}献立生成完了: 総処理時間 ${result.totalTime}ms`)
      return result

    } catch (error) {
      console.error(`❌ ${mealType}献立生成エラー:`, error)
      throw error
    }
  }

  // 🚀 最適化: バッチ保存
  async saveMealPlanOptimized(userId: string, weeklyPlan: any) {
    const saveStartTime = Date.now()
    
    try {
      const startDate = new Date(weeklyPlan.weekStartDate)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)

      // トランザクションで高速保存
      await prisma.$transaction(async (tx) => {
        // 既存データ削除
        await Promise.all([
          tx.mealPlan.deleteMany({
            where: {
              userId,
              date: { gte: startDate, lte: endDate }
            }
          }),
          tx.weeklyMealPlan.deleteMany({
            where: {
              userId,
              weekStartDate: startDate
            }
          })
        ])

        // 週間献立作成
        const weeklyMealPlan = await tx.weeklyMealPlan.create({
          data: {
            userId,
            weekStartDate: weeklyPlan.weekStartDate,
            totalNutrition: JSON.stringify({})
          }
        })

        // 日次献立をバッチ作成（存在しないレシピIDをnullに変換）
        const mealPlanData = weeklyPlan.plans.map((dayPlan: any) => ({
          userId,
          date: dayPlan.date,
          breakfastId: this.isValidRecipeId(dayPlan.breakfast?.id) ? dayPlan.breakfast.id : null,
          lunchId: this.isValidRecipeId(dayPlan.lunch?.id) ? dayPlan.lunch.id : null,
          dinnerId: this.isValidRecipeId(dayPlan.dinner?.id) ? dayPlan.dinner.id : null,
          isGenerated: true,
          generationSettings: JSON.stringify(weeklyPlan.settings),
          weeklyMealPlanId: weeklyMealPlan.id
        }))

        await tx.mealPlan.createMany({
          data: mealPlanData
        })

        return weeklyMealPlan
      })

      console.log(`💾 保存完了: ${Date.now() - saveStartTime}ms`)
      return { success: true }

    } catch (error) {
      console.error('❌ 献立保存エラー:', error)
      throw error
    }
  }

  // 🚀 部分的な保存処理
  async savePartialMealPlan(userId: string, partialPlan: any) {
    const saveStartTime = Date.now()
    
    try {
      const startDate = new Date(partialPlan.weekStartDate)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)

      console.log(`💾 ${partialPlan.mealType}の部分的保存開始...`)

      // 既存の献立データを取得して部分的に更新
      await prisma.$transaction(async (tx) => {
        for (const dayPlan of partialPlan.plans) {
          const date = new Date(dayPlan.date)
          
          // 既存の献立プランがあるかチェック
          const existingPlan = await tx.mealPlan.findFirst({
            where: {
              userId,
              date: {
                gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
              }
            }
          })

          const recipeId = this.isValidRecipeId(dayPlan[partialPlan.mealType]?.id) 
            ? dayPlan[partialPlan.mealType].id 
            : null

          if (existingPlan) {
            // 既存プランを部分的に更新
            const updateData: any = {
              isGenerated: true,
              generationSettings: JSON.stringify(partialPlan.settings)
            }
            
            if (partialPlan.mealType === 'breakfast') {
              updateData.breakfastId = recipeId
            } else if (partialPlan.mealType === 'lunch') {
              updateData.lunchId = recipeId
            } else if (partialPlan.mealType === 'dinner') {
              updateData.dinnerId = recipeId
            }

            await tx.mealPlan.update({
              where: { id: existingPlan.id },
              data: updateData
            })
          } else {
            // 新しいプランを作成
            const createData: any = {
              userId,
              date: dayPlan.date,
              breakfastId: null,
              lunchId: null,
              dinnerId: null,
              isGenerated: true,
              generationSettings: JSON.stringify(partialPlan.settings)
            }
            
            if (partialPlan.mealType === 'breakfast') {
              createData.breakfastId = recipeId
            } else if (partialPlan.mealType === 'lunch') {
              createData.lunchId = recipeId
            } else if (partialPlan.mealType === 'dinner') {
              createData.dinnerId = recipeId
            }

            await tx.mealPlan.create({
              data: createData
            })
          }
        }
      })

      console.log(`💾 ${partialPlan.mealType}の部分的保存完了: ${Date.now() - saveStartTime}ms`)
      return { success: true }

    } catch (error) {
      console.error(`❌ ${partialPlan.mealType}の部分的保存エラー:`, error)
      throw error
    }
  }
}