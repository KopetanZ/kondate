import { Builder, By, WebDriver, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
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

export class TwitterScraper {
  private driver: WebDriver | null = null

  async initialize() {
    const options = new chrome.Options()
    options.addArguments('--headless') // ヘッドレスモードで実行
    options.addArguments('--no-sandbox')
    options.addArguments('--disable-dev-shm-usage')
    options.addArguments('--disable-gpu')
    options.addArguments('--window-size=1920,1080')
    
    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build()
  }

  async scrapeUserPosts(username: string, maxPosts: number = 20): Promise<TwitterPost[]> {
    if (!this.driver) {
      throw new Error('Driver not initialized')
    }

    const posts: TwitterPost[] = []
    
    try {
      // Twitterのユーザーページにアクセス
      await this.driver.get(`https://twitter.com/${username}`)
      
      // ページの読み込みを待つ
      await this.driver.wait(until.elementLocated(By.css('[data-testid="tweet"]')), 10000)
      
      // スクロールしながらツイートを収集
      let lastHeight = 0
      let scrollAttempts = 0
      const maxScrollAttempts = 10
      
      while (posts.length < maxPosts && scrollAttempts < maxScrollAttempts) {
        // 現在表示されているツイートを取得
        const tweetElements = await this.driver.findElements(By.css('[data-testid="tweet"]'))
        
        for (const tweetElement of tweetElements) {
          if (posts.length >= maxPosts) break
          
          try {
            // ツイートテキストを取得
            const textElement = await tweetElement.findElement(By.css('[data-testid="tweetText"]'))
            const tweetText = await textElement.getText()
            
            // 〇〇定食を含むツイートのみを対象
            if (!tweetText.includes('定食')) continue
            
            // 日付を取得
            const timeElement = await tweetElement.findElement(By.css('time'))
            const dateTime = await timeElement.getAttribute('datetime')
            
            // 画像があるかチェック
            let imageUrl: string | undefined
            try {
              const imageElement = await tweetElement.findElement(By.css('[data-testid="tweetPhoto"] img'))
              imageUrl = await imageElement.getAttribute('src')
            } catch (e) {
              // 画像がない場合
            }
            
            // 献立名を抽出 (〇〇定食 → 〇〇)
            const menuName = this.extractMenuName(tweetText)
            
            // 重複チェック
            if (!posts.some(p => p.text === tweetText)) {
              posts.push({
                text: tweetText,
                imageUrl,
                date: dateTime,
                menuName,
                ingredients: await this.inferIngredients(menuName)
              })
            }
          } catch (e) {
            // 個別のツイート処理でエラーが出ても続行
            console.log('Error processing tweet:', e)
          }
        }
        
        // スクロール
        await this.driver.executeScript('window.scrollTo(0, document.body.scrollHeight)')
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const newHeight = await this.driver.executeScript('return document.body.scrollHeight')
        if (newHeight === lastHeight) {
          scrollAttempts++
        } else {
          scrollAttempts = 0
        }
        lastHeight = newHeight as number
      }
      
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
    
    // フォールバック: 最初の行を使用
    const firstLine = tweetText.split('\n')[0]
    return firstLine.replace('定食', '').trim()
  }

  private async inferIngredients(menuName: string): Promise<string[]> {
    // 献立名から材料を推測するロジック
    const ingredientMap: { [key: string]: string[] } = {
      '唐揚げ': ['鶏肉', '醤油', '生姜', 'にんにく', '片栗粉', '油'],
      '生姜焼き': ['豚肉', '玉ねぎ', '生姜', '醤油', 'みりん', '酒'],
      'ハンバーグ': ['牛ひき肉', '豚ひき肉', '玉ねぎ', 'パン粉', '卵', '牛乳'],
      '鮭': ['鮭', '塩', '胡椒'],
      'さば': ['さば', '味噌', 'みりん', '酒'],
      'カレー': ['牛肉', 'じゃがいも', '人参', '玉ねぎ', 'カレールー'],
      '肉じゃが': ['牛肉', 'じゃがいも', '人参', '玉ねぎ', '醤油', 'みりん', '酒', '砂糖'],
      '野菜炒め': ['キャベツ', '人参', 'もやし', 'ピーマン', '醤油', '塩', '胡椒']
    }

    // キーワードマッチングで材料を推測
    const ingredients: string[] = []
    for (const [keyword, items] of Object.entries(ingredientMap)) {
      if (menuName.includes(keyword)) {
        ingredients.push(...items)
      }
    }

    // デフォルトの基本材料を追加
    if (ingredients.length === 0) {
      ingredients.push('醤油', '塩', '胡椒', '油')
    }

    return [...new Set(ingredients)] // 重複除去
  }

  async downloadImage(imageUrl: string, filename: string): Promise<string> {
    if (!imageUrl) return ''
    
    try {
      const response = await fetch(imageUrl)
      const buffer = await response.arrayBuffer()
      
      // 画像保存ディレクトリを作成
      const imageDir = join(process.cwd(), 'public', 'scraped-images')
      if (!existsSync(imageDir)) {
        mkdirSync(imageDir, { recursive: true })
      }
      
      // 画像を最適化して保存
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
    if (this.driver) {
      await this.driver.quit()
    }
  }
}

// 使用例
export async function scrapeAndSaveMenus(username: string = 'sense_kabu') {
  const scraper = new TwitterScraper()
  
  try {
    await scraper.initialize()
    console.log(`Scraping @${username} posts...`)
    
    const posts = await scraper.scrapeUserPosts(username, 30)
    console.log(`Found ${posts.length} menu posts`)
    
    // 各投稿の画像をダウンロード
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      if (post.imageUrl) {
        const filename = `menu_${username}_${i + 1}`
        post.imageUrl = await scraper.downloadImage(post.imageUrl, filename)
      }
    }
    
    // JSONファイルとして保存
    const outputPath = join(process.cwd(), 'scraped-menus.json')
    writeFileSync(outputPath, JSON.stringify(posts, null, 2), 'utf-8')
    console.log(`Saved to ${outputPath}`)
    
    return posts
  } finally {
    await scraper.close()
  }
}