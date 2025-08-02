'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, ChefHat, ShoppingCart, Settings, Plus, Loader2 } from 'lucide-react'
import ShoppingList from './ShoppingList'

interface Recipe {
  id: string
  name: string
  cookingTime: number
  difficulty: number
  isRestDay?: boolean
}

interface DayMealPlan {
  date: string
  breakfast: Recipe | null
  lunch: Recipe | null
  dinner: Recipe | null
}

interface MealPlannerDashboardProps {
  currentUser: { id: string; familyName: string; familyIcon: string }
  onLogout: () => void
}

export default function MealPlannerDashboard({ currentUser, onLogout }: MealPlannerDashboardProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [mealPlans, setMealPlans] = useState<DayMealPlan[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [showShoppingList, setShowShoppingList] = useState(false)
  const [shoppingListWeekStart, setShoppingListWeekStart] = useState<Date | null>(null)

  const getWeekDates = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay()) // 日曜日から開始

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  const weekDates = getWeekDates(currentWeek)
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const getWeekStartDate = (date: Date) => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    return startOfWeek
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek)
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentWeek(newDate)
  }

  const fetchMealPlans = async (weekStart: Date) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/meal-plan?userId=${currentUser.id}&weekStartDate=${weekStart.toISOString()}`)
      if (response.ok) {
        const data = await response.json()
        setMealPlans(data.data.plans || [])
      }
    } catch (error) {
      console.error('Error fetching meal plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMealPlan = async () => {
    setGenerating(true)
    try {
      const weekStart = getWeekStartDate(currentWeek)
      const response = await fetch('/api/meal-plan/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          weekStartDate: weekStart.toISOString(),
          considerSeasonality: true,
          avoidRecentMeals: true,
          recentMealsDays: 14,
          includeVariety: true,
          maxSameCategoryPerWeek: 2
        })
      })

      if (response.ok) {
        const data = await response.json()
        // 生成後に献立を再取得
        await fetchMealPlans(weekStart)
      } else {
        console.error('Failed to generate meal plan')
      }
    } catch (error) {
      console.error('Error generating meal plan:', error)
    } finally {
      setGenerating(false)
    }
  }

  useEffect(() => {
    const weekStart = getWeekStartDate(currentWeek)
    fetchMealPlans(weekStart)
  }, [currentWeek])

  const getMealPlanForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return mealPlans.find(plan => plan.date.split('T')[0] === dateStr)
  }

  const createShoppingList = () => {
    const weekStart = getWeekStartDate(currentWeek)
    setShoppingListWeekStart(weekStart)
    setShowShoppingList(true)
  }

  if (showShoppingList) {
    return (
      <ShoppingList
        weekStartDate={shoppingListWeekStart?.toISOString()}
        userId={currentUser.id}
        onBack={() => {
          setShowShoppingList(false)
          setShoppingListWeekStart(null)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">献立プランナー</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{currentUser.familyIcon}</span>
                <span className="font-medium">{currentUser.familyName}</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  設定
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  献立を追加
                </Button>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  ログアウト
                </Button>
              </div>
            </div>
          </div>
          
          {/* Week Navigation */}
          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
            <Button variant="outline" onClick={() => navigateWeek('prev')}>
              ← 前週
            </Button>
            <h2 className="text-xl font-semibold">
              {currentWeek.getFullYear()}年 {currentWeek.getMonth() + 1}月 週間献立
            </h2>
            <Button variant="outline" onClick={() => navigateWeek('next')}>
              次週 →
            </Button>
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mb-8">
          {weekDates.map((date, index) => {
            const dayPlan = getMealPlanForDate(date)
            return (
              <Card key={index} className="min-h-[400px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-center">
                    <div className="text-sm font-medium text-gray-600">
                      {weekdays[index]}
                    </div>
                    <div className="text-lg font-bold">
                      {formatDate(date)}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    <>
                      {/* 朝食 */}
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <div className="text-xs font-medium text-yellow-700 mb-1">朝食</div>
                        <div className="text-sm text-gray-600 min-h-[20px]">
                          {dayPlan?.breakfast ? (
                            <div>
                              <div className="font-medium">{dayPlan.breakfast.name}</div>
                              {dayPlan.breakfast.cookingTime && (
                                <div className="text-xs text-gray-500 mt-1">
                                  調理時間: {dayPlan.breakfast.cookingTime}分
                                </div>
                              )}
                            </div>
                          ) : (
                            '未設定'
                          )}
                        </div>
                      </div>
                      
                      {/* 昼食 */}
                      <div className="bg-orange-50 rounded-lg p-3">
                        <div className="text-xs font-medium text-orange-700 mb-1">昼食</div>
                        <div className="text-sm text-gray-600 min-h-[20px]">
                          {dayPlan?.lunch ? (
                            <div>
                              <div className="font-medium">{dayPlan.lunch.name}</div>
                              {dayPlan.lunch.cookingTime && (
                                <div className="text-xs text-gray-500 mt-1">
                                  調理時間: {dayPlan.lunch.cookingTime}分
                                </div>
                              )}
                            </div>
                          ) : (
                            '未設定'
                          )}
                        </div>
                      </div>
                      
                      {/* 夕食 */}
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="text-xs font-medium text-purple-700 mb-1">夕食</div>
                        <div className="text-sm text-gray-600 min-h-[20px]">
                          {dayPlan?.dinner ? (
                            <div>
                              <div className="font-medium">
                                {dayPlan.dinner.isRestDay ? '🍽️ ' : ''}{dayPlan.dinner.name}
                              </div>
                              {dayPlan.dinner.cookingTime && !dayPlan.dinner.isRestDay && (
                                <div className="text-xs text-gray-500 mt-1">
                                  調理時間: {dayPlan.dinner.cookingTime}分
                                </div>
                              )}
                              {dayPlan.dinner.isRestDay && (
                                <div className="text-xs text-green-600 mt-1">
                                  休憩日
                                </div>
                              )}
                            </div>
                          ) : (
                            '未設定'
                          )}
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="w-full mt-2">
                        <Plus className="w-3 h-3 mr-1" />
                        追加
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChefHat className="w-5 h-5 mr-2 text-green-600" />
                献立を自動生成
              </CardTitle>
              <CardDescription>
                あなたの好みに基づいて1週間の献立を自動で作成します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={generateMealPlan}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  '今すぐ生成'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                買い物リスト
              </CardTitle>
              <CardDescription>
                今週の献立から必要な食材リストを作成します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={createShoppingList}
              >
                リスト作成
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                栄養バランス
              </CardTitle>
              <CardDescription>
                今週の栄養バランスを確認できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                確認する
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Today's Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>今日のおすすめレシピ</CardTitle>
              <CardDescription>季節の食材を使った料理を提案します</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <div className="font-medium">かぼちゃの煮物</div>
                  <div className="text-sm text-gray-600">調理時間: 30分 | 難易度: ★★☆</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="font-medium">さんまの塩焼き</div>
                  <div className="text-sm text-gray-600">調理時間: 15分 | 難易度: ★☆☆</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>旬の食材</CardTitle>
              <CardDescription>今月が旬の食材をご紹介</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm text-center">
                  かぼちゃ
                </div>
                <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm text-center">
                  りんご
                </div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm text-center">
                  ほうれん草
                </div>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm text-center">
                  さんま
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}