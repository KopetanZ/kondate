import { PrismaClient } from '@prisma/client'
import { scrapeWithPuppeteer } from '../src/lib/twitter-puppeteer'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

interface ScrapedMenu {
  text: string
  imageUrl?: string
  date: string
  menuName: string
  ingredients?: string[]
}

async function importScrapedMenus() {
  try {
    console.log('🔍 スクレイピングを開始します...')
    
    // 1. Twitterからデータをスクレイピング
    const scrapedPosts = await scrapeWithPuppeteer('sense_kabu')
    
    // 2. スクレイピング結果をデータベースに保存
    console.log('💾 データベースに保存中...')
    
    for (const post of scrapedPosts) {
      try {
        // 重複チェック
        const existingRecipe = await prisma.recipe.findFirst({
          where: { name: post.menuName }
        })
        
        if (existingRecipe) {
          console.log(`⏭️  スキップ: ${post.menuName} (既に存在)`)
          continue
        }
        
        // レシピを作成
        const recipe = await prisma.recipe.create({
          data: {
            name: post.menuName,
            category: 'dinner', // 定食なので夕食として分類
            cookingTime: 30, // デフォルト値
            difficulty: 3, // デフォルト値
            servings: 2, // デフォルト値
            instructions: JSON.stringify([
              '材料を準備する',
              '調理する',
              '盛り付けて完成'
            ]),
            nutrition: JSON.stringify({
              calories: 500,
              protein: 25,
              fat: 15,
              carbohydrates: 60,
              fiber: 5,
              sodium: 800
            }),
            tags: JSON.stringify(['定食', 'Twitter', 'sense_kabu']),
            notes: `@sense_kabuさんのツイートより: ${post.text.substring(0, 100)}...`,
            // 画像URLがあれば保存
            ...(post.imageUrl && { userRating: 5.0 }) // 画像があるものは高評価とする
          }
        })
        
        // 材料をデータベースに追加
        if (post.ingredients && post.ingredients.length > 0) {
          for (const ingredientName of post.ingredients) {
            // 材料が存在するかチェック
            let ingredient = await prisma.ingredient.findUnique({
              where: { name: ingredientName }
            })
            
            // 存在しない場合は作成
            if (!ingredient) {
              ingredient = await prisma.ingredient.create({
                data: {
                  name: ingredientName,
                  category: 'others', // デフォルトカテゴリ
                  unit: 'g',
                  nutritionPer100g: JSON.stringify({
                    calories: 100,
                    protein: 5,
                    fat: 3,
                    carbohydrates: 15,
                    fiber: 2,
                    sodium: 100
                  }),
                  storageType: 'pantry',
                  shelfLife: 7
                }
              })
            }
            
            // レシピと材料を関連付け
            await prisma.recipeIngredient.create({
              data: {
                recipeId: recipe.id,
                ingredientId: ingredient.id,
                quantity: 100, // デフォルト量
                unit: 'g'
              }
            })
          }
        }
        
        console.log(`✅ 追加: ${post.menuName}`)
        
      } catch (error) {
        console.error(`❌ エラー: ${post.menuName}`, error)
      }
    }
    
    console.log('🎉 インポート完了!')
    
  } catch (error) {
    console.error('インポート中にエラーが発生しました:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// 既存のJSONファイルからインポートする関数
async function importFromExistingFile() {
  const jsonPath = join(process.cwd(), 'scraped-menus.json')
  
  if (!existsSync(jsonPath)) {
    console.log('scraped-menus.json が見つかりません。スクレイピングから開始します。')
    return importScrapedMenus()
  }
  
  try {
    const data = readFileSync(jsonPath, 'utf-8')
    const scrapedPosts: ScrapedMenu[] = JSON.parse(data)
    
    console.log(`📁 既存のJSONファイルから ${scrapedPosts.length} 件のメニューを読み込み中...`)
    
    for (const post of scrapedPosts) {
      try {
        const existingRecipe = await prisma.recipe.findFirst({
          where: { name: post.menuName }
        })
        
        if (existingRecipe) {
          console.log(`⏭️  スキップ: ${post.menuName}`)
          continue
        }
        
        const recipe = await prisma.recipe.create({
          data: {
            name: post.menuName,
            category: 'dinner',
            cookingTime: 30,
            difficulty: 3,
            servings: 2,
            instructions: JSON.stringify([
              '材料を準備する',
              '調理する',
              '盛り付けて完成'
            ]),
            nutrition: JSON.stringify({
              calories: 500,
              protein: 25,
              fat: 15,
              carbohydrates: 60
            }),
            tags: JSON.stringify(['定食', 'Twitter']),
            notes: `Twitterより: ${post.text.substring(0, 100)}`
          }
        })
        
        console.log(`✅ 追加: ${post.menuName}`)
        
      } catch (error) {
        console.error(`❌ エラー: ${post.menuName}`, error)
      }
    }
    
  } catch (error) {
    console.error('JSONファイルの読み込みエラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// スクリプト実行
if (require.main === module) {
  importScrapedMenus()
}

export { importScrapedMenus, importFromExistingFile }