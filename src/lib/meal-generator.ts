import { prisma } from './db'
import { MealType, Season } from '@prisma/client'

export interface MealGenerationOptions {
  userId: string
  weekStartDate: Date
  considerSeasonality?: boolean
  avoidRecentMeals?: boolean
  recentMealsDays?: number
  includeVariety?: boolean
  maxSameCategoryPerWeek?: number
}

export class MealGenerator {
  private async getUserPreferences(userId: string) {
    let preferences = await prisma.userPreferences.findUnique({
      where: { userId }
    })
    
    // ユーザー設定が存在しない場合はデフォルト設定を作成
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

  private async getFilteredRecipes(options: {
    mealType: MealType
    season?: Season
    allergies: string[]
    excludeRecipeIds?: string[]
  }) {
    const { mealType, season, allergies, excludeRecipeIds = [] } = options

    let whereClause: any = {
      category: mealType,
      NOT: {
        id: { in: excludeRecipeIds }
      }
    }

    // 季節を考慮する場合（現在は季節フィルタリングを無効化）
    // if (season) {
    //   whereClause.OR = [
    //     { seasonality: { contains: season } },
    //     { seasonality: { equals: '[]' } } // 季節を問わないレシピ
    //   ]
    // }

    const recipes = await prisma.recipe.findMany({
      where: whereClause,
      include: {
        ingredients: {
          include: {
            ingredient: true
          }
        }
      }
    })

    // アレルギーフィルタリング
    const filteredRecipes = recipes.filter(recipe => {
      const recipeIngredients = recipe.ingredients.map(ri => ri.ingredient.name)
      return !allergies.some(allergy => 
        recipeIngredients.some(ingredient => 
          ingredient.toLowerCase().includes(allergy.toLowerCase())
        )
      )
    })

    return filteredRecipes
  }

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

  private selectRandomRecipe(recipes: any[], excludeIds: string[] = []) {
    const availableRecipes = recipes.filter(recipe => !excludeIds.includes(recipe.id))
    if (availableRecipes.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * availableRecipes.length)
    return availableRecipes[randomIndex]
  }

  async generateWeeklyMealPlan(options: MealGenerationOptions): Promise<any> {
    const {
      userId,
      weekStartDate,
      considerSeasonality = true,
      avoidRecentMeals = true,
      recentMealsDays = 14,
      includeVariety = true,
      maxSameCategoryPerWeek = 2
    } = options

    try {
      const preferences = await this.getUserPreferences(userId)
      const currentSeason = considerSeasonality ? this.getCurrentSeason() : undefined
      const recentRecipeIds = avoidRecentMeals ? await this.getRecentMealPlanIds(userId, recentMealsDays) : []

      // 週の日付を生成
      const weekDates = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStartDate)
        date.setDate(weekStartDate.getDate() + i)
        weekDates.push(date)
      }

      const generatedPlans: any[] = []
      const usedRecipeIds: string[] = []

      // 各日の献立を生成
      for (const date of weekDates) {
        const dayPlan: any = {
          date,
          breakfast: null,
          lunch: null,
          dinner: null
        }

        // 朝食生成
        if (preferences.eatsBreakfastBread || preferences.eatsGranolaOrCereal) {
          const breakfastRecipes = await this.getFilteredRecipes({
            mealType: MealType.breakfast,
            season: currentSeason,
            allergies: preferences.allergies,
            excludeRecipeIds: [...recentRecipeIds, ...usedRecipeIds]
          })
          
          const breakfast = this.selectRandomRecipe(breakfastRecipes)
          if (breakfast) {
            dayPlan.breakfast = breakfast
            usedRecipeIds.push(breakfast.id)
          }
        }

        // 昼食生成
        const lunchRecipes = await this.getFilteredRecipes({
          mealType: MealType.lunch,
          season: currentSeason,
          allergies: preferences.allergies,
          excludeRecipeIds: [...recentRecipeIds, ...usedRecipeIds]
        })

        // 昼食がない場合は夕食から選択
        let lunchCandidates = lunchRecipes
        if (lunchCandidates.length === 0) {
          lunchCandidates = await this.getFilteredRecipes({
            mealType: MealType.dinner,
            season: currentSeason,
            allergies: preferences.allergies,
            excludeRecipeIds: [...recentRecipeIds, ...usedRecipeIds]
          })
        }

        const lunch = this.selectRandomRecipe(lunchCandidates)
        if (lunch) {
          dayPlan.lunch = lunch
          usedRecipeIds.push(lunch.id)
        }

        // 夕食生成
        const dinnerRecipes = await this.getFilteredRecipes({
          mealType: MealType.dinner,
          season: currentSeason,
          allergies: preferences.allergies,
          excludeRecipeIds: [...recentRecipeIds, ...usedRecipeIds]
        })

        const dinner = this.selectRandomRecipe(dinnerRecipes)
        if (dinner) {
          dayPlan.dinner = dinner
          usedRecipeIds.push(dinner.id)
        }

        generatedPlans.push(dayPlan)
      }

      // 休憩日の処理
      if (preferences.wantsRestDays) {
        // ランダムに1-2日を休憩日にする
        const restDayCount = Math.floor(Math.random() * 2) + 1
        const restDayIndices: number[] = []
        
        while (restDayIndices.length < restDayCount) {
          const randomIndex = Math.floor(Math.random() * 7)
          if (!restDayIndices.includes(randomIndex)) {
            restDayIndices.push(randomIndex)
          }
        }

        restDayIndices.forEach(index => {
          if (preferences.usesFrozenFoods || preferences.usesPreparedFoods) {
            // 冷凍食品や惣菜を提案
            generatedPlans[index].dinner = {
              name: preferences.usesFrozenFoods ? '冷凍餃子' : 'お惣菜',
              isRestDay: true
            }
          }
        })
      }

      return {
        weekStartDate,
        plans: generatedPlans,
        generatedAt: new Date(),
        settings: {
          considerSeasonality,
          avoidRecentMeals,
          recentMealsDays,
          includeVariety,
          maxSameCategoryPerWeek
        }
      }

    } catch (error) {
      console.error('献立生成中のエラー:', error)
      throw error
    }
  }

  async saveMealPlan(userId: string, weeklyPlan: any) {
    try {
      // 既存の週間献立と各日の献立を削除
      const startDate = new Date(weeklyPlan.weekStartDate)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)

      // 既存の日次献立を削除
      await prisma.mealPlan.deleteMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate
          }
        }
      })

      // 既存の週間献立を削除
      await prisma.weeklyMealPlan.deleteMany({
        where: {
          userId,
          weekStartDate: startDate
        }
      })

      // 新しい週間献立を保存
      const weeklyMealPlan = await prisma.weeklyMealPlan.create({
        data: {
          userId,
          weekStartDate: weeklyPlan.weekStartDate,
          totalNutrition: JSON.stringify({}), // 後で栄養計算を実装
        }
      })

      // 各日の献立を保存
      for (const dayPlan of weeklyPlan.plans) {
        await prisma.mealPlan.create({
          data: {
            userId,
            date: dayPlan.date,
            breakfastId: dayPlan.breakfast?.id || null,
            lunchId: dayPlan.lunch?.id || null,
            dinnerId: dayPlan.dinner?.id || null,
            isGenerated: true,
            generationSettings: JSON.stringify(weeklyPlan.settings),
            weeklyMealPlanId: weeklyMealPlan.id
          }
        })
      }

      return weeklyMealPlan
    } catch (error) {
      console.error('献立保存中のエラー:', error)
      throw error
    }
  }
}