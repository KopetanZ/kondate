'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Clock, Star } from 'lucide-react'

interface Recipe {
  id: string
  name: string
  category: string
  cookingTime: number
  difficulty: number
  servings: number
  tags: string[]
  nutrition: {
    calories: number
    protein: number
    fat: number
    carbs?: number
    carbohydrates?: number
  }
}

interface RecipeSelectionDialogProps {
  open: boolean
  onClose: () => void
  onSelect: (recipe: Recipe) => void
  mealType: 'breakfast' | 'lunch' | 'dinner'
  date: string
}

export default function RecipeSelectionDialog({
  open,
  onClose,
  onSelect,
  mealType,
  date
}: RecipeSelectionDialogProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const mealTypeLabels = {
    breakfast: '朝食',
    lunch: '昼食',
    dinner: '夕食'
  }

  const fetchRecipes = useCallback(async () => {
    setLoading(true)
    try {
      console.log(`Fetching recipes for ${mealType}...`)
      const response = await fetch(`/api/recipes?category=${mealType}&limit=50`)
      console.log('API Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('API Response data:', data)
        console.log('Recipes count:', data.recipes?.length || 0)
        
        setRecipes(data.recipes || [])
        setFilteredRecipes(data.recipes || [])
      } else {
        console.error('API Error:', await response.text())
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }, [mealType])

  useEffect(() => {
    if (open) {
      fetchRecipes()
      setSearchTerm('')
    }
  }, [open, fetchRecipes])

  useEffect(() => {
    if (searchTerm) {
      const filtered = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredRecipes(filtered)
    } else {
      setFilteredRecipes(recipes)
    }
  }, [searchTerm, recipes])

  const handleSelect = (recipe: Recipe) => {
    onSelect(recipe)
    onClose()
  }

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < difficulty ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {mealTypeLabels[mealType]}のレシピを選択
          </DialogTitle>
          <DialogDescription>
            {new Date(date).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}のレシピを選んでください
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="レシピ名やタグで検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Recipe List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">レシピを読み込み中...</div>
              </div>
            ) : filteredRecipes.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">
                  {searchTerm ? 'レシピが見つかりませんでした' : 'レシピがありません'}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleSelect(recipe)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-lg">{recipe.name}</h3>
                      <div className="flex items-center">
                        {getDifficultyStars(recipe.difficulty)}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Clock className="w-4 h-4 mr-1" />
                      {recipe.cookingTime}分
                      <span className="mx-2">•</span>
                      {recipe.servings}人分
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {recipe.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {recipe.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{recipe.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 grid grid-cols-4 gap-2">
                      <div>カロリー: {recipe.nutrition.calories}kcal</div>
                      <div>タンパク質: {recipe.nutrition.protein}g</div>
                      <div>脂質: {recipe.nutrition.fat}g</div>
                      <div>炭水化物: {recipe.nutrition.carbs || recipe.nutrition.carbohydrates || 0}g</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}