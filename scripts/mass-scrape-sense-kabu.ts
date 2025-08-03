#!/usr/bin/env node

/**
 * @sense_kabu 大量ツイートスクレイピングスクリプト
 * 
 * 使用方法:
 * npm run scrape:mass -- --target 30000
 * 
 * オプション:
 * --target: 取得目標件数 (デフォルト: 30000)
 * --resume: 中断した場合の再開 (デフォルト: true)
 * --batch-size: バッチサイズ (デフォルト: 100)
 */

import { massScrapeSenseKabu } from '../src/lib/twitter-mass-scraper'

interface ScriptOptions {
  target: number
  resume: boolean
  batchSize: number
}

function parseArgs(): ScriptOptions {
  const args = process.argv.slice(2)
  const options: ScriptOptions = {
    target: 30000,
    resume: true,
    batchSize: 100
  }

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]
    const value = args[i + 1]

    switch (key) {
      case '--target':
        options.target = parseInt(value) || 30000
        break
      case '--resume':
        options.resume = value.toLowerCase() === 'true'
        break
      case '--batch-size':
        options.batchSize = parseInt(value) || 100
        break
    }
  }

  return options
}

async function main() {
  console.log('🚀 @sense_kabu 大量ツイートスクレイピング開始')
  console.log('=' .repeat(50))
  
  const options = parseArgs()
  
  console.log(`📊 設定:`)
  console.log(`   目標件数: ${options.target.toLocaleString()}件`)
  console.log(`   レジューム: ${options.resume ? 'あり' : 'なし'}`)
  console.log(`   バッチサイズ: ${options.batchSize}件`)
  console.log('')
  
  const startTime = Date.now()
  
  try {
    // 大量スクレイピング実行
    const posts = await massScrapeSenseKabu(options.target)
    
    const endTime = Date.now()
    const duration = Math.round((endTime - startTime) / 1000)
    
    console.log('')
    console.log('🎉 スクレイピング完了!')
    console.log('=' .repeat(50))
    console.log(`📊 結果:`)
    console.log(`   取得した食事投稿: ${posts.length.toLocaleString()}件`)
    console.log(`   実行時間: ${Math.floor(duration / 60)}分${duration % 60}秒`)
    console.log(`   平均速度: ${Math.round(posts.length / (duration / 60))}件/分`)
    console.log('')
    
    // 重複チェック統計
    const uniqueMenus = new Set(posts.map(p => p.menuName))
    console.log(`📈 統計:`)
    console.log(`   ユニークメニュー数: ${uniqueMenus.size}件`)
    console.log(`   重複率: ${Math.round((1 - uniqueMenus.size / posts.length) * 100)}%`)
    console.log('')
    
    // 人気メニューTop10
    const menuCounts = new Map<string, number>()
    posts.forEach(post => {
      const count = menuCounts.get(post.menuName) || 0
      menuCounts.set(post.menuName, count + 1)
    })
    
    const topMenus = Array.from(menuCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
    
    console.log(`🏆 人気メニューTop10:`)
    topMenus.forEach(([menu, count], index) => {
      console.log(`   ${index + 1}. ${menu} (${count}回)`)
    })
    console.log('')
    
    console.log('✅ データベースへのインポートを実行してください:')
    console.log('   npm run import:scraped')
    
  } catch (error) {
    console.error('❌ スクレイピングエラー:', error)
    process.exit(1)
  }
}

// 終了時の処理
process.on('SIGINT', () => {
  console.log('\n⚠️ スクレイピングが中断されました')
  console.log('💡 "--resume true" オプションで再開できます')
  process.exit(0)
})

process.on('uncaughtException', (error) => {
  console.error('❌ 予期しないエラー:', error)
  process.exit(1)
})

if (require.main === module) {
  main()
}