import { prisma } from './db'
import { IngredientCategory, MealType, Season } from '@prisma/client'

// 基本的な食材データ
const ingredients = [
  // 野菜
  {
    name: 'にんじん',
    category: IngredientCategory.vegetables,
    nutritionPer100g: JSON.stringify({
      calories: 37,
      protein: 0.6,
      fat: 0.1,
      carbohydrates: 9.1,
      fiber: 2.8,
      sodium: 28,
      calcium: 27,
      iron: 0.2,
      vitaminC: 4
    }),
    peakSeasons: JSON.stringify([Season.autumn, Season.winter]),
    storageType: 'refrigerated',
    shelfLife: 14
  },
  {
    name: '玉ねぎ',
    category: IngredientCategory.vegetables,
    nutritionPer100g: JSON.stringify({
      calories: 37,
      protein: 1.0,
      fat: 0.1,
      carbohydrates: 8.8,
      fiber: 1.6,
      sodium: 2,
      calcium: 21,
      iron: 0.2,
      vitaminC: 8
    }),
    peakSeasons: JSON.stringify([Season.spring, Season.summer]),
    storageType: 'pantry',
    shelfLife: 30
  },
  {
    name: 'じゃがいも',
    category: IngredientCategory.vegetables,
    nutritionPer100g: JSON.stringify({
      calories: 76,
      protein: 1.6,
      fat: 0.1,
      carbohydrates: 17.6,
      fiber: 1.3,
      sodium: 1,
      calcium: 3,
      iron: 0.4,
      vitaminC: 35
    }),
    peakSeasons: JSON.stringify([Season.autumn]),
    storageType: 'pantry',
    shelfLife: 21
  },
  {
    name: 'キャベツ',
    category: IngredientCategory.vegetables,
    nutritionPer100g: JSON.stringify({
      calories: 23,
      protein: 1.3,
      fat: 0.2,
      carbohydrates: 5.2,
      fiber: 1.8,
      sodium: 5,
      calcium: 43,
      iron: 0.3,
      vitaminC: 41
    }),
    peakSeasons: JSON.stringify([Season.spring, Season.winter]),
    storageType: 'refrigerated',
    shelfLife: 10
  },
  {
    name: 'トマト',
    category: IngredientCategory.vegetables,
    nutritionPer100g: JSON.stringify({
      calories: 19,
      protein: 0.7,
      fat: 0.1,
      carbohydrates: 4.7,
      fiber: 1.0,
      sodium: 3,
      calcium: 7,
      iron: 0.2,
      vitaminC: 15
    }),
    peakSeasons: JSON.stringify([Season.summer]),
    storageType: 'refrigerated',
    shelfLife: 7
  },

  // 肉類
  {
    name: '鶏むね肉',
    category: IngredientCategory.meat,
    nutritionPer100g: JSON.stringify({
      calories: 108,
      protein: 22.3,
      fat: 1.5,
      carbohydrates: 0,
      fiber: 0,
      sodium: 39,
      calcium: 4,
      iron: 0.2,
      vitaminC: 0
    }),
    peakSeasons: JSON.stringify([Season.spring, Season.summer, Season.autumn, Season.winter]),
    storageType: 'refrigerated',
    shelfLife: 3
  },
  {
    name: '鶏もも肉',
    category: IngredientCategory.meat,
    nutritionPer100g: JSON.stringify({
      calories: 200,
      protein: 16.2,
      fat: 14.0,
      carbohydrates: 0,
      fiber: 0,
      sodium: 51,
      calcium: 6,
      iron: 0.6,
      vitaminC: 0
    }),
    peakSeasons: JSON.stringify([Season.spring, Season.summer, Season.autumn, Season.winter]),
    storageType: 'refrigerated',
    shelfLife: 3
  },
  {
    name: '豚バラ肉',
    category: IngredientCategory.meat,
    nutritionPer100g: JSON.stringify({
      calories: 386,
      protein: 14.2,
      fat: 34.6,
      carbohydrates: 0.1,
      fiber: 0,
      sodium: 59,
      calcium: 4,
      iron: 0.6,
      vitaminC: 1
    }),
    peakSeasons: JSON.stringify([Season.spring, Season.summer, Season.autumn, Season.winter]),
    storageType: 'refrigerated',
    shelfLife: 3
  },
  {
    name: '牛こま切れ肉',
    category: IngredientCategory.meat,
    nutritionPer100g: JSON.stringify({
      calories: 180,
      protein: 19.5,
      fat: 10.7,
      carbohydrates: 0.2,
      fiber: 0,
      sodium: 53,
      calcium: 4,
      iron: 2.5,
      vitaminC: 0
    }),
    peakSeasons: JSON.stringify([Season.spring, Season.summer, Season.autumn, Season.winter]),
    storageType: 'refrigerated',
    shelfLife: 3
  },

  // 魚類
  {
    name: 'さけ',
    category: IngredientCategory.fish,
    nutritionPer100g: JSON.stringify({
      calories: 133,
      protein: 22.3,
      fat: 4.1,
      carbohydrates: 0.1,
      fiber: 0,
      sodium: 59,
      calcium: 10,
      iron: 0.5,
      vitaminC: 1
    }),
    peakSeasons: JSON.stringify([Season.autumn]),
    storageType: 'refrigerated',
    shelfLife: 2
  },
  {
    name: 'さんま',
    category: IngredientCategory.fish,
    nutritionPer100g: JSON.stringify({
      calories: 310,
      protein: 18.5,
      fat: 24.6,
      carbohydrates: 0.1,
      fiber: 0,
      sodium: 130,
      calcium: 32,
      iron: 1.4,
      vitaminC: 0
    }),
    peakSeasons: JSON.stringify([Season.autumn]),
    storageType: 'refrigerated',
    shelfLife: 2
  },

  // 穀物
  {
    name: '米',
    category: IngredientCategory.grains,
    nutritionPer100g: JSON.stringify({
      calories: 356,
      protein: 6.1,
      fat: 0.9,
      carbohydrates: 77.1,
      fiber: 0.5,
      sodium: 1,
      calcium: 5,
      iron: 0.8,
      vitaminC: 0
    }),
    peakSeasons: JSON.stringify([Season.spring, Season.summer, Season.autumn, Season.winter]),
    storageType: 'pantry',
    shelfLife: 365
  },
  {
    name: 'パン',
    category: IngredientCategory.grains,
    nutritionPer100g: JSON.stringify({
      calories: 264,
      protein: 9.3,
      fat: 4.4,
      carbohydrates: 46.7,
      fiber: 2.3,
      sodium: 500,
      calcium: 29,
      iron: 0.6,
      vitaminC: 0
    }),
    peakSeasons: JSON.stringify([Season.spring, Season.summer, Season.autumn, Season.winter]),
    storageType: 'pantry',
    shelfLife: 5
  },

  // 調味料
  {
    name: '醤油',
    category: IngredientCategory.seasonings,
    nutritionPer100g: JSON.stringify({
      calories: 71,
      protein: 7.7,
      fat: 0,
      carbohydrates: 10.1,
      fiber: 0,
      sodium: 14500,
      calcium: 17,
      iron: 2.1,
      vitaminC: 0
    }),
    peakSeasons: JSON.stringify([Season.spring, Season.summer, Season.autumn, Season.winter]),
    storageType: 'pantry',
    shelfLife: 730
  },
  {
    name: '味噌',
    category: IngredientCategory.seasonings,
    nutritionPer100g: JSON.stringify({
      calories: 192,
      protein: 12.9,
      fat: 5.1,
      carbohydrates: 17.0,
      fiber: 4.1,
      sodium: 4900,
      calcium: 75,
      iron: 2.7,
      vitaminC: 0
    }),
    peakSeasons: JSON.stringify([Season.spring, Season.summer, Season.autumn, Season.winter]),
    storageType: 'pantry',
    shelfLife: 365
  }
]

// 基本的なレシピデータ
const recipes = [
  {
    name: '肉じゃが',
    category: MealType.dinner,
    cookingTime: 45,
    difficulty: 2,
    servings: 4,
    instructions: JSON.stringify([
      'じゃがいもとにんじんを一口大に切る',
      '玉ねぎをくし切りにする',
      '牛肉を一口大に切る',
      '鍋に油を熱し、牛肉を炒める',
      '野菜を加えて炒める',
      'だし汁、醤油、砂糖、みりんを加えて煮込む',
      '20-30分煮込んで完成'
    ]),
    nutrition: JSON.stringify({
      calories: 280,
      protein: 15.2,
      fat: 8.5,
      carbohydrates: 35.0,
      fiber: 3.2,
      sodium: 800,
      calcium: 35,
      iron: 2.1,
      vitaminC: 25
    }),
    seasonality: JSON.stringify([Season.autumn, Season.winter]),
    tags: JSON.stringify(['和食', '煮物', '家庭料理']),
    ingredients: [
      { name: 'じゃがいも', quantity: 400, unit: 'g' },
      { name: 'にんじん', quantity: 150, unit: 'g' },
      { name: '玉ねぎ', quantity: 200, unit: 'g' },
      { name: '牛こま切れ肉', quantity: 200, unit: 'g' },
      { name: '醤油', quantity: 60, unit: 'ml' }
    ]
  },
  {
    name: '親子丼',
    category: MealType.dinner,
    cookingTime: 25,
    difficulty: 2,
    servings: 2,
    instructions: JSON.stringify([
      '鶏もも肉を一口大に切る',
      '玉ねぎを薄切りにする',
      'フライパンにだし汁、醤油、砂糖を入れて煮立てる',
      '鶏肉と玉ねぎを加えて煮る',
      '溶き卵を回し入れて半熟状態にする',
      'ご飯にのせて完成'
    ]),
    nutrition: JSON.stringify({
      calories: 520,
      protein: 28.5,
      fat: 18.2,
      carbohydrates: 65.0,
      fiber: 1.8,
      sodium: 1200,
      calcium: 45,
      iron: 2.8,
      vitaminC: 8
    }),
    seasonality: JSON.stringify([Season.spring, Season.summer, Season.autumn, Season.winter]),
    tags: JSON.stringify(['和食', '丼物', '卵料理']),
    ingredients: [
      { name: '鶏もも肉', quantity: 200, unit: 'g' },
      { name: '玉ねぎ', quantity: 100, unit: 'g' },
      { name: '米', quantity: 300, unit: 'g' },
      { name: '醤油', quantity: 40, unit: 'ml' }
    ]
  },
  {
    name: '野菜炒め',
    category: MealType.dinner,
    cookingTime: 15,
    difficulty: 1,
    servings: 2,
    instructions: JSON.stringify([
      'キャベツを一口大に切る',
      'にんじんを短冊切りにする',
      '豚バラ肉を一口大に切る',
      'フライパンに油を熱し、豚肉を炒める',
      '野菜を加えて強火で炒める',
      '醤油で味付けして完成'
    ]),
    nutrition: JSON.stringify({
      calories: 320,
      protein: 18.5,
      fat: 22.8,
      carbohydrates: 12.0,
      fiber: 3.5,
      sodium: 650,
      calcium: 55,
      iron: 1.2,
      vitaminC: 35
    }),
    seasonality: JSON.stringify([Season.spring, Season.summer, Season.autumn, Season.winter]),
    tags: JSON.stringify(['中華', '炒め物', '野菜料理']),
    ingredients: [
      { name: 'キャベツ', quantity: 200, unit: 'g' },
      { name: 'にんじん', quantity: 100, unit: 'g' },
      { name: '豚バラ肉', quantity: 150, unit: 'g' },
      { name: '醤油', quantity: 30, unit: 'ml' }
    ]
  },
  {
    name: '鮭の塩焼き',
    category: MealType.dinner,
    cookingTime: 20,
    difficulty: 1,
    servings: 2,
    instructions: JSON.stringify([
      'さけに塩をふって10分おく',
      'グリルまたはフライパンで焼く',
      '片面5-7分ずつ焼く',
      '焼き色がついたら完成'
    ]),
    nutrition: JSON.stringify({
      calories: 133,
      protein: 22.3,
      fat: 4.1,
      carbohydrates: 0.1,
      fiber: 0,
      sodium: 200,
      calcium: 10,
      iron: 0.5,
      vitaminC: 1
    }),
    seasonality: JSON.stringify([Season.autumn]),
    tags: JSON.stringify(['和食', '焼き物', '魚料理']),
    ingredients: [
      { name: 'さけ', quantity: 200, unit: 'g' }
    ]
  },
  {
    name: 'トーストセット',
    category: MealType.breakfast,
    cookingTime: 10,
    difficulty: 1,
    servings: 1,
    instructions: JSON.stringify([
      'パンをトースターで焼く',
      'お好みでバターやジャムを塗る'
    ]),
    nutrition: JSON.stringify({
      calories: 280,
      protein: 9.8,
      fat: 6.4,
      carbohydrates: 49.2,
      fiber: 2.4,
      sodium: 530,
      calcium: 30,
      iron: 0.6,
      vitaminC: 0
    }),
    seasonality: JSON.stringify([Season.spring, Season.summer, Season.autumn, Season.winter]),
    tags: JSON.stringify(['洋食', 'パン', '朝食']),
    ingredients: [
      { name: 'パン', quantity: 100, unit: 'g' }
    ]
  },

  // カレー系レシピとアレンジ
  {
    name: 'ビーフカレー',
    category: MealType.dinner,
    cookingTime: 60,
    difficulty: 2,
    servings: 4,
    instructions: JSON.stringify([
      '牛肉を一口大に切る',
      'じゃがいも、にんじん、玉ねぎを一口大に切る',
      '鍋に油を熱し、牛肉を炒める',
      '野菜を加えて炒める',
      '水を加えて20分煮込む',
      'カレールーを加えて10分煮込む',
      'ご飯と一緒に盛り付けて完成'
    ]),
    nutrition: JSON.stringify({
      calories: 450,
      protein: 22.0,
      fat: 18.5,
      carbohydrates: 58.0,
      fiber: 3.8,
      sodium: 950,
      calcium: 45,
      iron: 2.8,
      vitaminC: 20
    }),
    seasonality: JSON.stringify([Season.spring, Season.summer, Season.autumn, Season.winter]),
    tags: JSON.stringify(['洋食', 'カレー', '人気料理']),
    ingredients: [
      { name: '牛こま切れ肉', quantity: 300, unit: 'g' },
      { name: 'じゃがいも', quantity: 300, unit: 'g' },
      { name: 'にんじん', quantity: 150, unit: 'g' },
      { name: '玉ねぎ', quantity: 200, unit: 'g' },
      { name: '米', quantity: 300, unit: 'g' }
    ]
  },
  {
    name: 'カレーうどん',
    category: MealType.lunch,
    cookingTime: 20,
    difficulty: 1,
    servings: 2,
    instructions: JSON.stringify([
      '冷凍うどんを茹でる',
      '残ったカレーに水とだし汁を加えて薄める',
      'カレースープを温める',
      '茹でたうどんを器に盛る',
      'カレースープをかけて完成'
    ]),
    nutrition: JSON.stringify({
      calories: 380,
      protein: 12.5,
      fat: 8.2,
      carbohydrates: 68.0,
      fiber: 2.5,
      sodium: 800,
      calcium: 25,
      iron: 1.5,
      vitaminC: 8
    }),
    seasonality: JSON.stringify([Season.spring, Season.summer, Season.autumn, Season.winter]),
    tags: JSON.stringify(['和食', 'うどん', 'カレーアレンジ', 'リメイク']),
    ingredients: [
      { name: '米', quantity: 50, unit: 'g' } // カレーの残りを想定
    ]
  },
  {
    name: 'カレードリア',
    category: MealType.dinner,
    cookingTime: 30,
    difficulty: 2,
    servings: 2,
    instructions: JSON.stringify([
      'ご飯を耐熱皿に盛る',
      '残ったカレーをご飯の上にかける',
      'ホワイトソースを作る',
      'チーズとホワイトソースをのせる',
      'オーブンで15分焼いて完成'
    ]),
    nutrition: JSON.stringify({
      calories: 520,
      protein: 18.8,
      fat: 22.5,
      carbohydrates: 65.0,
      fiber: 2.8,
      sodium: 1100,
      calcium: 180,
      iron: 2.2,
      vitaminC: 12
    }),
    seasonality: JSON.stringify([Season.spring, Season.summer, Season.autumn, Season.winter]),
    tags: JSON.stringify(['洋食', 'ドリア', 'カレーアレンジ', 'リメイク']),
    ingredients: [
      { name: '米', quantity: 200, unit: 'g' } // カレーの残りを想定
    ]
  },
  {
    name: 'チキンカレー',
    category: MealType.dinner,
    cookingTime: 45,
    difficulty: 2,
    servings: 4,
    instructions: JSON.stringify([
      '鶏もも肉を一口大に切る',
      'じゃがいも、にんじん、玉ねぎを切る',
      '鍋に油を熱し、鶏肉を炒める',
      '野菜を加えて炒める',
      '水を加えて煮込む',
      'カレールーを加えて仕上げる'
    ]),
    nutrition: JSON.stringify({
      calories: 420,
      protein: 25.0,
      fat: 16.8,
      carbohydrates: 52.0,
      fiber: 3.5,
      sodium: 900,
      calcium: 40,
      iron: 2.5,
      vitaminC: 18
    }),
    seasonality: JSON.stringify([Season.spring, Season.summer, Season.autumn, Season.winter]),
    tags: JSON.stringify(['洋食', 'カレー', 'チキン']),
    ingredients: [
      { name: '鶏もも肉', quantity: 300, unit: 'g' },
      { name: 'じゃがいも', quantity: 300, unit: 'g' },
      { name: 'にんじん', quantity: 150, unit: 'g' },
      { name: '玉ねぎ', quantity: 200, unit: 'g' },
      { name: '米', quantity: 300, unit: 'g' }
    ]
  },
  {
    name: 'ポークカレー',
    category: MealType.dinner,
    cookingTime: 50,
    difficulty: 2,
    servings: 4,
    instructions: JSON.stringify([
      '豚バラ肉を一口大に切る',
      '野菜を切る',
      '鍋で豚肉を炒める',
      '野菜を加えて炒める',
      '水を加えて煮込む',
      'カレールーで味付けする'
    ]),
    nutrition: JSON.stringify({
      calories: 480,
      protein: 20.5,
      fat: 22.0,
      carbohydrates: 55.0,
      fiber: 3.2,
      sodium: 920,
      calcium: 38,
      iron: 2.8,
      vitaminC: 15
    }),
    seasonality: JSON.stringify([Season.spring, Season.summer, Season.autumn, Season.winter]),
    tags: JSON.stringify(['洋食', 'カレー', 'ポーク']),
    ingredients: [
      { name: '豚バラ肉', quantity: 300, unit: 'g' },
      { name: 'じゃがいも', quantity: 300, unit: 'g' },
      { name: 'にんじん', quantity: 150, unit: 'g' },
      { name: '玉ねぎ', quantity: 200, unit: 'g' },
      { name: '米', quantity: 300, unit: 'g' }
    ]
  }
]

export async function seedDatabase() {
  try {
    console.log('🌱 データベースにシードデータを投入中...')

    // 食材データを投入
    console.log('📝 食材データを投入中...')
    for (const ingredient of ingredients) {
      await prisma.ingredient.upsert({
        where: { name: ingredient.name },
        update: ingredient,
        create: ingredient
      })
    }

    console.log('🍳 レシピデータを投入中...')
    // レシピデータを投入
    for (const recipe of recipes) {
      const { ingredients: recipeIngredients, ...recipeData } = recipe
      
      // 既存のレシピをチェック
      const existingRecipe = await prisma.recipe.findFirst({
        where: { name: recipe.name }
      })
      
      let createdRecipe
      if (existingRecipe) {
        createdRecipe = existingRecipe
      } else {
        createdRecipe = await prisma.recipe.create({
          data: recipeData
        })
      }

      // レシピの食材を追加
      for (const ingredient of recipeIngredients) {
        const ingredientRecord = await prisma.ingredient.findUnique({
          where: { name: ingredient.name }
        })
        
        if (ingredientRecord) {
          await prisma.recipeIngredient.upsert({
            where: {
              recipeId_ingredientId: {
                recipeId: createdRecipe.id,
                ingredientId: ingredientRecord.id
              }
            },
            update: {
              quantity: ingredient.quantity,
              unit: ingredient.unit
            },
            create: {
              recipeId: createdRecipe.id,
              ingredientId: ingredientRecord.id,
              quantity: ingredient.quantity,
              unit: ingredient.unit
            }
          })
        }
      }
    }

    console.log('✅ シードデータの投入が完了しました！')
  } catch (error) {
    console.error('❌ シードデータの投入中にエラーが発生しました:', error)
    throw error
  }
}