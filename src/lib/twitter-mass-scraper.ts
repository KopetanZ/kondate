import puppeteer from 'puppeteer'
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs'
import { join } from 'path'
import sharp from 'sharp'

interface TwitterPost {
  text: string
  imageUrl?: string
  date: string
  menuName: string
  ingredients?: string[]
  id: string
  url?: string
}

interface ScrapingProgress {
  totalProcessed: number
  foodPostsFound: number
  lastProcessedDate: string
  uniqueMenus: Set<string>
  processedTweetIds: Set<string>
}

export class TwitterMassScraper {
  private browser: any = null
  private page: any = null
  private progress: ScrapingProgress
  private outputDir: string
  private batchSize: number = 100
  private maxRetries: number = 3
  private delayBetweenBatches: number = 5000

  constructor() {
    this.outputDir = join(process.cwd(), 'scraped-data')
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true })
    }
    
    this.progress = {
      totalProcessed: 0,
      foodPostsFound: 0,
      lastProcessedDate: '',
      uniqueMenus: new Set(),
      processedTweetIds: new Set()
    }
    
    this.loadProgress()
  }

  private loadProgress() {
    const progressFile = join(this.outputDir, 'scraping-progress.json')
    if (existsSync(progressFile)) {
      try {
        const data = JSON.parse(readFileSync(progressFile, 'utf-8'))
        this.progress = {
          totalProcessed: data.totalProcessed || 0,
          foodPostsFound: data.foodPostsFound || 0,
          lastProcessedDate: data.lastProcessedDate || '',
          uniqueMenus: new Set(data.uniqueMenus || []),
          processedTweetIds: new Set(data.processedTweetIds || [])
        }
        console.log(`📊 進捗を復元: 処理済み${this.progress.totalProcessed}件, 食事投稿${this.progress.foodPostsFound}件`)
      } catch (error) {
        console.log('進捗ファイルの読み込みに失敗、新規開始します')
      }
    }
  }

  private saveProgress() {
    const progressFile = join(this.outputDir, 'scraping-progress.json')
    const data = {
      totalProcessed: this.progress.totalProcessed,
      foodPostsFound: this.progress.foodPostsFound,
      lastProcessedDate: this.progress.lastProcessedDate,
      uniqueMenus: Array.from(this.progress.uniqueMenus),
      processedTweetIds: Array.from(this.progress.processedTweetIds)
    }
    writeFileSync(progressFile, JSON.stringify(data, null, 2), 'utf-8')
  }

  async initialize() {
    console.log('🚀 ブラウザを初期化中...')
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI'
      ]
    })
    
    this.page = await this.browser.newPage()
    
    // パフォーマンス最適化
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    await this.page.setViewport({ width: 1200, height: 800 })
    
    // 不要なリソースをブロック
    await this.page.setRequestInterception(true)
    this.page.on('request', (request: any) => {
      const resourceType = request.resourceType()
      if (['stylesheet', 'font', 'media'].includes(resourceType)) {
        request.abort()
      } else {
        request.continue()
      }
    })
  }

  async scrapeAllPosts(username: string = 'sense_kabu', targetCount: number = 30000): Promise<TwitterPost[]> {
    if (!this.page) {
      throw new Error('Browser not initialized')
    }

    const allPosts: TwitterPost[] = []
    let retryCount = 0
    let consecutiveFailures = 0
    
    try {
      console.log(`📱 @${username} のプロフィールにアクセス中...`)
      
      await this.page.goto(`https://twitter.com/${username}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      })
      
      // 初期読み込み待機
      await this.waitForContent()
      
      console.log(`🎯 目標: ${targetCount}件のツイートから食事関連投稿を抽出`)
      console.log(`📈 現在の進捗: 処理済み${this.progress.totalProcessed}件`)
      
      let previousHeight = 0
      let stuckCounter = 0
      const maxStuckAttempts = 10
      
      while (this.progress.totalProcessed < targetCount && consecutiveFailures < 5) {
        try {
          // 現在表示されているツイートを取得
          const tweets = await this.extractTweetsFromPage()
          
          if (tweets.length === 0) {
            console.log('⚠️ ツイートが見つかりません、再試行中...')
            consecutiveFailures++
            await this.waitForContent(3000)
            continue
          }
          
          consecutiveFailures = 0
          
          // ツイートを処理
          let newPostsInBatch = 0
          for (const tweet of tweets) {
            // 重複チェック
            if (this.progress.processedTweetIds.has(tweet.id)) {
              continue
            }
            
            this.progress.processedTweetIds.add(tweet.id)
            this.progress.totalProcessed++
            
            // 食事関連かチェック
            if (this.isFoodRelated(tweet.text)) {
              const menuName = this.extractMenuName(tweet.text)
              
              // 重複メニューチェック（より緩い条件）
              if (!this.isDuplicateMenu(menuName)) {
                this.progress.uniqueMenus.add(menuName)
                
                const post: TwitterPost = {
                  ...tweet,
                  menuName,
                  ingredients: await this.inferIngredients(menuName)
                }
                
                allPosts.push(post)
                this.progress.foodPostsFound++
                newPostsInBatch++
                
                console.log(`🍽️ [${this.progress.foodPostsFound}] ${menuName}`)
              }
            }
            
            if (this.progress.totalProcessed % 100 === 0) {
              console.log(`📊 進捗: ${this.progress.totalProcessed}/${targetCount} (食事投稿: ${this.progress.foodPostsFound}件)`)
              this.saveProgress()
              this.saveBatch(allPosts)
            }
          }
          
          if (newPostsInBatch === 0) {
            console.log('新しい食事投稿が見つかりません、スクロール継続...')
          }
          
          // スクロールダウン
          const currentHeight = await this.page.evaluate(() => document.body.scrollHeight)
          
          if (currentHeight === previousHeight) {
            stuckCounter++
            if (stuckCounter >= maxStuckAttempts) {
              console.log('⚠️ ページの末尾に到達したと思われます')
              break
            }
            // より長い待機時間
            await this.waitForContent(3000)
          } else {
            stuckCounter = 0
          }
          
          await this.page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight)
          })
          
          // レート制限対策
          await this.waitForContent(this.delayBetweenBatches)
          previousHeight = currentHeight
          
        } catch (error) {
          console.error(`❌ バッチ処理エラー:`, error)
          retryCount++
          
          if (retryCount >= this.maxRetries) {
            console.log('最大リトライ回数に達しました')
            break
          }
          
          await this.waitForContent(10000) // エラー時は長めの待機
        }
      }
      
      console.log(`✅ スクレイピング完了!`)
      console.log(`📊 最終結果: 処理済み${this.progress.totalProcessed}件, 食事投稿${this.progress.foodPostsFound}件`)
      
    } catch (error) {
      console.error('❌ スクレイピングエラー:', error)
    }
    
    return allPosts
  }

  private async extractTweetsFromPage(): Promise<TwitterPost[]> {
    return await this.page.evaluate(() => {
      const tweets: any[] = []
      
      // より具体的なセレクター
      const articles = document.querySelectorAll('article[data-testid="tweet"], article[role="article"]')
      
      articles.forEach((article: any) => {
        try {
          // ツイートIDの取得
          const linkElement = article.querySelector('a[href*="/status/"]')
          if (!linkElement) return
          
          const href = linkElement.getAttribute('href')
          const idMatch = href.match(/\/status\/(\d+)/)
          if (!idMatch) return
          
          const id = idMatch[1]
          
          // テキストの取得
          const textElement = article.querySelector('[data-testid="tweetText"]')
          if (!textElement) return
          
          const text = textElement.innerText || textElement.textContent || ''
          if (text.length < 5) return
          
          // 日時の取得
          const timeElement = article.querySelector('time')
          const dateTime = timeElement ? 
            timeElement.getAttribute('datetime') : 
            new Date().toISOString()
          
          // 画像の取得
          const imageElement = article.querySelector('[data-testid="tweetPhoto"] img')
          const imageUrl = imageElement ? imageElement.src : ''
          
          tweets.push({
            id,
            text: text.trim(),
            imageUrl,
            date: dateTime,
            url: `https://twitter.com${href}`
          })
          
        } catch (e) {
          // エラーは無視
        }
      })
      
      return tweets
    })
  }

  private isFoodRelated(text: string): boolean {
    const foodKeywords = [
      '定食', '弁当', 'ランチ', '昼食', '朝食', '夕食', '晩御飯',
      '唐揚げ', 'ハンバーグ', '生姜焼き', 'カレー', '焼き魚', '煮物',
      '炒め物', '揚げ物', '焼き物', '煮魚', 'フライ', 'ステーキ',
      'おかず', 'メニュー', '料理', '食事', '今日の', '本日の'
    ]
    
    return foodKeywords.some(keyword => text.includes(keyword))
  }

  private extractMenuName(tweetText: string): string {
    // 〇〇定食パターン
    let match = tweetText.match(/(.+?)定食/)
    if (match) {
      return match[1].trim()
    }
    
    // 今日の〇〇パターン
    match = tweetText.match(/今日の(.+?)[\s\n。！]/)
    if (match) {
      return match[1].trim()
    }
    
    // 本日の〇〇パターン
    match = tweetText.match(/本日の(.+?)[\s\n。！]/)
    if (match) {
      return match[1].trim()
    }
    
    // 最初の行をメニュー名として使用
    const firstLine = tweetText.split('\n')[0]
    return firstLine.replace(/[定食弁当ランチ昼食朝食夕食]/g, '').trim()
  }

  private isDuplicateMenu(menuName: string): boolean {
    // 完全一致チェック
    if (this.progress.uniqueMenus.has(menuName)) {
      return true
    }
    
    // 類似メニューチェック（文字の一部が共通）
    for (const existingMenu of this.progress.uniqueMenus) {
      if (this.calculateSimilarity(menuName, existingMenu) > 0.8) {
        return true
      }
    }
    
    return false
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const len1 = str1.length
    const len2 = str2.length
    
    if (len1 === 0 || len2 === 0) return 0
    
    let commonChars = 0
    for (let i = 0; i < Math.min(len1, len2); i++) {
      if (str1[i] === str2[i]) {
        commonChars++
      }
    }
    
    return commonChars / Math.max(len1, len2)
  }

  private async inferIngredients(menuName: string): Promise<string[]> {
    const ingredientMap: { [key: string]: string[] } = {
      '唐揚げ': ['鶏肉', '醤油', '生姜', 'にんにく', '片栗粉', '揚げ油'],
      '生姜焼き': ['豚肉', '玉ねぎ', '生姜', '醤油', 'みりん', '酒'],
      'ハンバーグ': ['牛ひき肉', '豚ひき肉', '玉ねぎ', 'パン粉', '卵', '牛乳'],
      '鮭': ['鮭', '塩', '胡椒', 'バター'],
      'さば': ['さば', '味噌', 'みりん', '酒', '生姜'],
      'カレー': ['牛肉', 'じゃがいも', '人参', '玉ねぎ', 'カレールー'],
      '肉じゃが': ['牛肉', 'じゃがいも', '人参', '玉ねぎ', '醤油', 'みりん'],
      '野菜炒め': ['キャベツ', '人参', 'もやし', 'ピーマン', '醤油', '油'],
      '焼き魚': ['魚', '塩', '胡椒', '大根おろし'],
      'とんかつ': ['豚ロース', 'パン粉', '卵', '小麦粉', '揚げ油'],
      'エビフライ': ['エビ', 'パン粉', '卵', '小麦粉', '揚げ油'],
      '親子丼': ['鶏肉', '卵', '玉ねぎ', '醤油', 'みりん', 'だし'],
      '牛丼': ['牛肉', '玉ねぎ', '醤油', 'みりん', '砂糖'],
      '焼肉': ['牛肉', '醤油', 'にんにく', '胡麻油', 'コチュジャン'],
      '餃子': ['豚ひき肉', 'キャベツ', 'にら', 'にんにく', '生姜'],
      'チャーハン': ['ご飯', '卵', 'ネギ', 'チャーシュー', '醤油'],
      'ラーメン': ['麺', 'チャーシュー', 'ネギ', 'メンマ', 'のり'],
      '天ぷら': ['エビ', '野菜', '天ぷら粉', '揚げ油'],
      '刺身': ['魚', '醤油', 'わさび', '大根つま'],
      '煮物': ['大根', '人参', '里芋', '醤油', 'みりん', 'だし']
    }

    const ingredients: string[] = ['ご飯'] // 定食なので基本はご飯

    // キーワードマッチング
    for (const [keyword, items] of Object.entries(ingredientMap)) {
      if (menuName.includes(keyword)) {
        ingredients.push(...items)
      }
    }

    // デフォルト調味料
    if (ingredients.length === 1) {
      ingredients.push('醤油', '塩', '胡椒', '油')
    }

    return [...new Set(ingredients)] // 重複除去
  }

  private async waitForContent(duration: number = 2000) {
    await new Promise(resolve => setTimeout(resolve, duration))
  }

  private saveBatch(posts: TwitterPost[]) {
    const batchFile = join(this.outputDir, `scraped-menus-batch-${Date.now()}.json`)
    writeFileSync(batchFile, JSON.stringify(posts, null, 2), 'utf-8')
  }

  async downloadImages(posts: TwitterPost[]): Promise<void> {
    console.log(`📸 ${posts.length}件の画像をダウンロード中...`)
    
    const imageDir = join(this.outputDir, 'images')
    if (!existsSync(imageDir)) {
      mkdirSync(imageDir, { recursive: true })
    }
    
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      if (post.imageUrl) {
        try {
          const filename = `menu_${post.id}`
          const localPath = await this.downloadImage(post.imageUrl, filename, imageDir)
          if (localPath) {
            post.imageUrl = localPath
            console.log(`📷 [${i + 1}/${posts.length}] ${filename}`)
          }
        } catch (error) {
          console.error(`画像ダウンロードエラー [${i + 1}]:`, error)
        }
        
        // レート制限対策
        if (i % 10 === 0) {
          await this.waitForContent(1000)
        }
      }
    }
  }

  private async downloadImage(imageUrl: string, filename: string, outputDir: string): Promise<string> {
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) return ''
      
      const buffer = await response.arrayBuffer()
      const imagePath = join(outputDir, `${filename}.jpg`)
      
      await sharp(Buffer.from(buffer))
        .resize(400, 400, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toFile(imagePath)
      
      return `/scraped-data/images/${filename}.jpg`
    } catch (error) {
      console.error('Image download error:', error)
      return ''
    }
  }

  async saveResults(posts: TwitterPost[]): Promise<string> {
    this.saveProgress()
    
    const outputFile = join(this.outputDir, `scraped-menus-final-${Date.now()}.json`)
    writeFileSync(outputFile, JSON.stringify(posts, null, 2), 'utf-8')
    
    // 統計情報も保存
    const stats = {
      totalScraped: posts.length,
      totalProcessed: this.progress.totalProcessed,
      uniqueMenus: Array.from(this.progress.uniqueMenus),
      scrapeDate: new Date().toISOString(),
      duplicatesFiltered: this.progress.totalProcessed - posts.length
    }
    
    const statsFile = join(this.outputDir, `scraping-stats-${Date.now()}.json`)
    writeFileSync(statsFile, JSON.stringify(stats, null, 2), 'utf-8')
    
    console.log(`💾 結果保存: ${outputFile}`)
    console.log(`📊 統計保存: ${statsFile}`)
    
    return outputFile
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
    }
  }
}

// 大量スクレイピング実行関数
export async function massScrapeSenseKabu(targetCount: number = 30000): Promise<TwitterPost[]> {
  const scraper = new TwitterMassScraper()
  
  try {
    await scraper.initialize()
    
    console.log(`🚀 @sense_kabu の大量スクレイピング開始 (目標: ${targetCount}件)`)
    const posts = await scraper.scrapeAllPosts('sense_kabu', targetCount)
    
    if (posts.length > 0) {
      console.log('📸 画像ダウンロード開始...')
      await scraper.downloadImages(posts)
    }
    
    const outputFile = await scraper.saveResults(posts)
    
    console.log(`✅ スクレイピング完了!`)
    console.log(`📊 取得した食事投稿: ${posts.length}件`)
    console.log(`💾 保存場所: ${outputFile}`)
    
    return posts
    
  } catch (error) {
    console.error('❌ 大量スクレイピングエラー:', error)
    throw error
  } finally {
    await scraper.close()
  }
}