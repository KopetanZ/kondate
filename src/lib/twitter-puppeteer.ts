import puppeteer from 'puppeteer'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import sharp from 'sharp'

interface TwitterPost {
  text: string
  imageUrl?: string
  date: string
  menuName: string
  ingredients?: string[]
}

export class TwitterPuppeteerScraper {
  private browser: any = null
  private page: any = null

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ]
    })
    
    this.page = await this.browser.newPage()
    
    // ユーザーエージェントを設定
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
    
    // ビューポートを設定
    await this.page.setViewport({ width: 1200, height: 800 })
  }

  async scrapeUserPosts(username: string, maxPosts: number = 20): Promise<TwitterPost[]> {
    if (!this.page) {
      throw new Error('Browser not initialized')
    }

    const posts: TwitterPost[] = []
    
    try {
      console.log(`Navigating to @${username} profile...`)
      
      // Twitterのユーザーページにアクセス
      await this.page.goto(`https://twitter.com/${username}`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      })
      
      // ページが読み込まれるまで待機
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // デバッグ用スクリーンショット
      await this.page.screenshot({ path: 'twitter-debug.png', fullPage: true })
      console.log('Screenshot saved as twitter-debug.png')
      
      // スクロールしながらツイートを収集
      let previousHeight = 0
      let scrollAttempts = 0
      const maxScrollAttempts = 10
      
      while (posts.length < maxPosts && scrollAttempts < maxScrollAttempts) {
        // 現在のツイートを取得
        const tweets = await this.page.evaluate(() => {
          // より柔軟なセレクターを使用
          const articles = document.querySelectorAll('article, [data-testid="tweet"], [role="article"]')
          const results: any[] = []
          
          articles.forEach((article: any) => {
            try {
              // ツイートテキストを取得（複数のセレクターを試す）
              let text = ''
              const textSelectors = [
                '[data-testid="tweetText"]',
                '[lang]',
                '.css-901oao',
                'span[style*="color"]'
              ]
              
              for (const selector of textSelectors) {
                const textElement = article.querySelector(selector)
                if (textElement) {
                  text = textElement.innerText || textElement.textContent || ''
                  if (text.length > 10) break // 意味のあるテキストが見つかったら停止
                }
              }
              
              if (!text || text.length < 5) return
              
              // 定食を含むツイートのみ
              if (!text.includes('定食')) return
              
              // 時間を取得
              const timeElement = article.querySelector('time')
              const dateTime = timeElement ? timeElement.getAttribute('datetime') : new Date().toISOString()
              
              // 画像を取得（複数のセレクターを試す）
              let imageUrl = ''
              const imageSelectors = [
                '[data-testid="tweetPhoto"] img',
                'img[alt*="Image"]',
                'img[src*="pbs.twimg.com"]'
              ]
              
              for (const selector of imageSelectors) {
                const imageElement = article.querySelector(selector)
                if (imageElement && imageElement.src) {
                  imageUrl = imageElement.src
                  break
                }
              }
              
              results.push({
                text: text.trim(),
                imageUrl,
                date: dateTime
              })
            } catch (e) {
              console.log('Error processing tweet element:', e)
            }
          })
          
          return results
        })
        
        // 新しいツイートを処理
        for (const tweet of tweets) {
          if (posts.length >= maxPosts) break
          
          const menuName = this.extractMenuName(tweet.text)
          
          // 重複チェック
          if (!posts.some(p => p.text === tweet.text)) {
            posts.push({
              text: tweet.text,
              imageUrl: tweet.imageUrl,
              date: tweet.date,
              menuName,
              ingredients: await this.inferIngredients(menuName)
            })
            
            console.log(`Found: ${menuName}`)
          }
        }
        
        // スクロール
        const currentHeight = await this.page.evaluate(() => document.body.scrollHeight)
        
        if (currentHeight === previousHeight) {
          scrollAttempts++
        } else {
          scrollAttempts = 0
        }
        
        await this.page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight)
        })
        
        await new Promise(resolve => setTimeout(resolve, 2000))
        previousHeight = currentHeight
      }
      
      console.log(`Scraped ${posts.length} menu posts`)
      
    } catch (error) {
      console.error('Scraping error:', error)
    }
    
    return posts
  }

  private extractMenuName(tweetText: string): string {
    // 〇〇定食から献立名を抽出
    const match = tweetText.match(/(.+?)定食/)
    if (match) {
      return match[1].trim()
    }
    
    // フォールバック
    const firstLine = tweetText.split('\n')[0]
    return firstLine.replace('定食', '').trim()
  }

  private async inferIngredients(menuName: string): Promise<string[]> {
    const ingredientMap: { [key: string]: string[] } = {
      '唐揚げ': ['鶏肉', '醤油', '生姜', 'にんにく', '片栗粉', '油'],
      '生姜焼き': ['豚肉', '玉ねぎ', '生姜', '醤油', 'みりん', '酒'],
      'ハンバーグ': ['牛ひき肉', '豚ひき肉', '玉ねぎ', 'パン粉', '卵', '牛乳'],
      '鮭': ['鮭', '塩', '胡椒'],
      'さば': ['さば', '味噌', 'みりん', '酒'],
      'カレー': ['牛肉', 'じゃがいも', '人参', '玉ねぎ', 'カレールー'],
      '肉じゃが': ['牛肉', 'じゃがいも', '人参', '玉ねぎ', '醤油', 'みりん'],
      '野菜炒め': ['キャベツ', '人参', 'もやし', 'ピーマン', '醤油'],
      '鶏': ['鶏肉', '醤油', '塩', '胡椒'],
      '豚': ['豚肉', '醤油', '塩', '胡椒'],
      '牛': ['牛肉', '醤油', '塩', '胡椒'],
      '魚': ['魚', '塩', '胡椒'],
      'エビ': ['エビ', '塩', '胡椒'],
      'イカ': ['イカ', '醤油', '生姜']
    }

    const ingredients: string[] = []
    
    // キーワードマッチング
    for (const [keyword, items] of Object.entries(ingredientMap)) {
      if (menuName.includes(keyword)) {
        ingredients.push(...items)
        break // 最初にマッチしたもので止める
      }
    }

    // デフォルト材料
    if (ingredients.length === 0) {
      ingredients.push('醤油', '塩', '胡椒', '油', 'ご飯')
    } else {
      ingredients.push('ご飯') // 定食なのでご飯は必須
    }

    return [...new Set(ingredients)]
  }

  async downloadImage(imageUrl: string, filename: string): Promise<string> {
    if (!imageUrl) return ''
    
    try {
      const response = await fetch(imageUrl)
      const buffer = await response.arrayBuffer()
      
      const imageDir = join(process.cwd(), 'public', 'scraped-images')
      if (!existsSync(imageDir)) {
        mkdirSync(imageDir, { recursive: true })
      }
      
      const imagePath = join(imageDir, `${filename}.jpg`)
      await sharp(Buffer.from(buffer))
        .resize(400, 400, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toFile(imagePath)
      
      return `/scraped-images/${filename}.jpg`
    } catch (error) {
      console.error('Image download error:', error)
      return ''
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
    }
  }
}

// 使用例
export async function scrapeWithPuppeteer(username: string = 'sense_kabu') {
  const scraper = new TwitterPuppeteerScraper()
  
  try {
    console.log('🤖 Puppeteerを初期化中...')
    await scraper.initialize()
    
    console.log(`📱 @${username} のツイートをスクレイピング中...`)
    const posts = await scraper.scrapeUserPosts(username, 30)
    
    console.log(`📸 ${posts.length}件の画像をダウンロード中...`)
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      if (post.imageUrl) {
        const filename = `menu_${username}_${Date.now()}_${i}`
        post.imageUrl = await scraper.downloadImage(post.imageUrl, filename)
      }
    }
    
    // 結果を保存
    const outputPath = join(process.cwd(), 'scraped-menus.json')
    writeFileSync(outputPath, JSON.stringify(posts, null, 2), 'utf-8')
    console.log(`💾 結果を保存: ${outputPath}`)
    
    return posts
  } finally {
    await scraper.close()
  }
}