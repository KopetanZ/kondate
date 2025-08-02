'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ShoppingCart, Trash2, Check } from 'lucide-react'
import { IngredientCategory } from '@prisma/client'

interface ShoppingItem {
  id: string
  quantity: number
  unit: string
  isPurchased: boolean
  estimatedPrice?: number
  actualPrice?: number
  notes?: string
  ingredient: {
    id: string
    name: string
    category: IngredientCategory
  }
}

interface ShoppingListData {
  id: string
  name: string
  weekStartDate: string
  isCompleted: boolean
  items: ShoppingItem[]
  createdAt: string
}

interface ShoppingListProps {
  listId?: string
  onBack: () => void
  weekStartDate?: string
  userId?: string
}

const categoryLabels: Record<IngredientCategory, string> = {
  vegetables: '野菜',
  fruits: '果物',
  meat: '肉類',
  fish: '魚類',
  dairy: '乳製品',
  grains: '穀物',
  legumes: '豆類',
  seasonings: '調味料',
  oils: '油類',
  others: 'その他'
}

const categoryColors: Record<IngredientCategory, string> = {
  vegetables: 'bg-green-100 text-green-800',
  fruits: 'bg-orange-100 text-orange-800',
  meat: 'bg-red-100 text-red-800',
  fish: 'bg-blue-100 text-blue-800',
  dairy: 'bg-yellow-100 text-yellow-800',
  grains: 'bg-amber-100 text-amber-800',
  legumes: 'bg-lime-100 text-lime-800',
  seasonings: 'bg-purple-100 text-purple-800',
  oils: 'bg-indigo-100 text-indigo-800',
  others: 'bg-gray-100 text-gray-800'
}

export default function ShoppingList({ listId, onBack, weekStartDate, userId = 'demo-user' }: ShoppingListProps) {
  const [shoppingList, setShoppingList] = useState<ShoppingListData | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (listId) {
      fetchShoppingList()
    } else if (weekStartDate) {
      generateShoppingList()
    }
  }, [listId, weekStartDate])

  const fetchShoppingList = async () => {
    if (!listId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/shopping-list?listId=${listId}`)
      if (response.ok) {
        const data = await response.json()
        setShoppingList(data.data)
      }
    } catch (error) {
      console.error('Error fetching shopping list:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateShoppingList = async () => {
    if (!weekStartDate) return
    
    setGenerating(true)
    try {
      const response = await fetch('/api/shopping-list/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          weekStartDate
        })
      })

      if (response.ok) {
        const data = await response.json()
        setShoppingList(data.data)
      }
    } catch (error) {
      console.error('Error generating shopping list:', error)
    } finally {
      setGenerating(false)
    }
  }

  const toggleItemPurchased = async (itemId: string, isPurchased: boolean) => {
    try {
      const response = await fetch('/api/shopping-list', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          isPurchased
        })
      })

      if (response.ok && shoppingList) {
        setShoppingList(prev => ({
          ...prev!,
          items: prev!.items.map(item => 
            item.id === itemId ? { ...item, isPurchased } : item
          )
        }))
      }
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const updateItemPrice = async (itemId: string, actualPrice: number) => {
    try {
      const response = await fetch('/api/shopping-list', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          actualPrice
        })
      })

      if (response.ok && shoppingList) {
        setShoppingList(prev => ({
          ...prev!,
          items: prev!.items.map(item => 
            item.id === itemId ? { ...item, actualPrice } : item
          )
        }))
      }
    } catch (error) {
      console.error('Error updating price:', error)
    }
  }

  const markListCompleted = async () => {
    if (!shoppingList) return
    
    try {
      const response = await fetch('/api/shopping-list', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listId: shoppingList.id,
          isCompleted: true
        })
      })

      if (response.ok) {
        setShoppingList(prev => ({
          ...prev!,
          isCompleted: true
        }))
      }
    } catch (error) {
      console.error('Error completing list:', error)
    }
  }

  if (loading || generating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p>{generating ? '買い物リストを生成中...' : '読み込み中...'}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!shoppingList) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <p>買い物リストを生成できませんでした。</p>
            <Button onClick={onBack} className="mt-4">
              戻る
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // カテゴリ別にアイテムをグループ化
  const itemsByCategory = shoppingList.items.reduce((acc, item) => {
    const category = item.ingredient.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<IngredientCategory, ShoppingItem[]>)

  const purchasedCount = shoppingList.items.filter(item => item.isPurchased).length
  const totalCount = shoppingList.items.length
  const progress = totalCount > 0 ? (purchasedCount / totalCount) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              戻る
            </Button>
            {!shoppingList.isCompleted && (
              <Button onClick={markListCompleted} disabled={purchasedCount !== totalCount}>
                <Check className="w-4 h-4 mr-2" />
                完了
              </Button>
            )}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                {shoppingList.name}
              </CardTitle>
              <CardDescription>
                作成日: {new Date(shoppingList.createdAt).toLocaleDateString('ja-JP')}
                {shoppingList.isCompleted && (
                  <Badge className="ml-2 bg-green-100 text-green-800">完了</Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>進捗状況</span>
                  <span>{purchasedCount}/{totalCount} 完了</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shopping Items by Category */}
        <div className="space-y-6">
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Badge className={categoryColors[category as IngredientCategory]}>
                    {categoryLabels[category as IngredientCategory]}
                  </Badge>
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    {items.length}点
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        item.isPurchased ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <Checkbox
                          checked={item.isPurchased}
                          onCheckedChange={(checked) => 
                            toggleItemPurchased(item.id, checked as boolean)
                          }
                        />
                        <div className="flex-1">
                          <div className={`font-medium ${item.isPurchased ? 'line-through text-gray-500' : ''}`}>
                            {item.ingredient.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.quantity} {item.unit}
                            {item.notes && ` • ${item.notes}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="価格"
                          value={item.actualPrice || ''}
                          onChange={(e) => {
                            const price = parseFloat(e.target.value)
                            if (!isNaN(price)) {
                              updateItemPrice(item.id, price)
                            }
                          }}
                          className="w-20 text-sm"
                        />
                        <span className="text-sm text-gray-500">円</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">総合計（入力された価格のみ）</div>
                <div className="text-2xl font-bold">
                  ¥{shoppingList.items
                    .filter(item => item.actualPrice)
                    .reduce((sum, item) => sum + (item.actualPrice || 0), 0)
                    .toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">購入済み</div>
                <div className="text-lg font-semibold text-green-600">
                  {purchasedCount}/{totalCount}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}