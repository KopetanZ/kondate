'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface NutritionData {
  calories: number
  protein: number
  fat: number
  carbohydrates: number
  fiber: number
  sodium: number
}

interface NutritionTarget {
  dailyCalories: number
  dailyProtein: number
  dailyFat: number
  dailyCarbohydrates: number
  dailyFiber: number
  dailySodium: number
}

interface WeeklyNutritionData {
  daily: Array<{
    date: string
    nutrition: NutritionData
  }>
  weeklyTotal: NutritionData
  weeklyAverage: NutritionData
  target: NutritionTarget
}

interface NutritionBalanceProps {
  weekStartDate: string
  userId: string
  onBack: () => void
}

export default function NutritionBalance({ weekStartDate, userId, onBack }: NutritionBalanceProps) {
  const [nutritionData, setNutritionData] = useState<WeeklyNutritionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNutritionData()
  }, [weekStartDate, userId])

  const fetchNutritionData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/nutrition/weekly?userId=${userId}&weekStartDate=${weekStartDate}`)
      if (response.ok) {
        const data = await response.json()
        setNutritionData(data.data)
      }
    } catch (error) {
      console.error('Error fetching nutrition data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNutritionStatus = (actual: number, target: number) => {
    const percentage = (actual / target) * 100
    if (percentage < 80) return { status: 'low', icon: TrendingDown, color: 'text-red-600' }
    if (percentage > 120) return { status: 'high', icon: TrendingUp, color: 'text-orange-600' }
    return { status: 'good', icon: Minus, color: 'text-green-600' }
  }

  const formatNutrition = (value: number, unit: string) => {
    return `${Math.round(value * 10) / 10}${unit}`
  }

  const getPercentageBar = (actual: number, target: number) => {
    const percentage = Math.min((actual / target) * 100, 150) // Cap at 150% for display
    return percentage
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-lg">栄養バランスを分析中...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!nutritionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-gray-600">栄養データが見つかりませんでした</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const weekDates = nutritionData.daily.map(d => new Date(d.date))
  const startDate = weekDates[0]
  const endDate = weekDates[weekDates.length - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">栄養バランス分析</h1>
          <p className="text-gray-600">
            {startDate.getMonth() + 1}月{startDate.getDate()}日 - {endDate.getMonth() + 1}月{endDate.getDate()}日
          </p>
        </div>

        {/* Weekly Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            { key: 'calories', label: 'カロリー', unit: 'kcal', target: nutritionData.target.dailyCalories },
            { key: 'protein', label: 'タンパク質', unit: 'g', target: nutritionData.target.dailyProtein },
            { key: 'fat', label: '脂質', unit: 'g', target: nutritionData.target.dailyFat },
            { key: 'carbohydrates', label: '炭水化物', unit: 'g', target: nutritionData.target.dailyCarbohydrates },
            { key: 'fiber', label: '食物繊維', unit: 'g', target: nutritionData.target.dailyFiber },
            { key: 'sodium', label: 'ナトリウム', unit: 'mg', target: nutritionData.target.dailySodium }
          ].map(({ key, label, unit, target }) => {
            const actual = nutritionData.weeklyAverage[key as keyof NutritionData]
            const status = getNutritionStatus(actual, target)
            const percentage = getPercentageBar(actual, target)
            const StatusIcon = status.icon

            return (
              <Card key={key}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    {label}
                    <StatusIcon className={`w-4 h-4 ${status.color}`} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">平均</span>
                      <span className="font-medium">{formatNutrition(actual, unit)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">目標</span>
                      <span>{formatNutrition(target, unit)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          status.status === 'good' ? 'bg-green-500' :
                          status.status === 'low' ? 'bg-red-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      {Math.round((actual / target) * 100)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Daily Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>日別栄養摂取量</CardTitle>
            <CardDescription>1週間の栄養摂取量の推移</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">日付</th>
                    <th className="text-right p-2">カロリー</th>
                    <th className="text-right p-2">タンパク質</th>
                    <th className="text-right p-2">脂質</th>
                    <th className="text-right p-2">炭水化物</th>
                    <th className="text-right p-2">食物繊維</th>
                    <th className="text-right p-2">ナトリウム</th>
                  </tr>
                </thead>
                <tbody>
                  {nutritionData.daily.map((day, index) => {
                    const date = new Date(day.date)
                    const weekdays = ['日', '月', '火', '水', '木', '金', '土']
                    
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div className="font-medium">
                            {date.getMonth() + 1}/{date.getDate()} ({weekdays[date.getDay()]})
                          </div>
                        </td>
                        <td className="text-right p-2">{formatNutrition(day.nutrition.calories, 'kcal')}</td>
                        <td className="text-right p-2">{formatNutrition(day.nutrition.protein, 'g')}</td>
                        <td className="text-right p-2">{formatNutrition(day.nutrition.fat, 'g')}</td>
                        <td className="text-right p-2">{formatNutrition(day.nutrition.carbohydrates, 'g')}</td>
                        <td className="text-right p-2">{formatNutrition(day.nutrition.fiber, 'g')}</td>
                        <td className="text-right p-2">{formatNutrition(day.nutrition.sodium, 'mg')}</td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-medium">
                    <td className="p-2">週平均</td>
                    <td className="text-right p-2">{formatNutrition(nutritionData.weeklyAverage.calories, 'kcal')}</td>
                    <td className="text-right p-2">{formatNutrition(nutritionData.weeklyAverage.protein, 'g')}</td>
                    <td className="text-right p-2">{formatNutrition(nutritionData.weeklyAverage.fat, 'g')}</td>
                    <td className="text-right p-2">{formatNutrition(nutritionData.weeklyAverage.carbohydrates, 'g')}</td>
                    <td className="text-right p-2">{formatNutrition(nutritionData.weeklyAverage.fiber, 'g')}</td>
                    <td className="text-right p-2">{formatNutrition(nutritionData.weeklyAverage.sodium, 'mg')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Advice */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>栄養アドバイス</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { key: 'calories', target: nutritionData.target.dailyCalories, actual: nutritionData.weeklyAverage.calories, label: 'カロリー' },
                { key: 'protein', target: nutritionData.target.dailyProtein, actual: nutritionData.weeklyAverage.protein, label: 'タンパク質' },
                { key: 'fiber', target: nutritionData.target.dailyFiber, actual: nutritionData.weeklyAverage.fiber, label: '食物繊維' }
              ].map(({ key, target, actual, label }) => {
                const percentage = (actual / target) * 100
                let advice = ''
                let color = ''

                if (percentage < 80) {
                  advice = `${label}が不足しています。目標値の${Math.round(percentage)}%です。`
                  color = 'text-red-600 bg-red-50'
                } else if (percentage > 120) {
                  advice = `${label}が過剰です。目標値の${Math.round(percentage)}%です。`
                  color = 'text-orange-600 bg-orange-50'
                } else {
                  advice = `${label}は適正範囲内です。`
                  color = 'text-green-600 bg-green-50'
                }

                return (
                  <div key={key} className={`p-3 rounded-lg ${color}`}>
                    <p className="text-sm font-medium">{advice}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}