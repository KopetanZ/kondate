import { seedDatabase } from '../src/lib/seed-data'

async function main() {
  try {
    console.log('🚀 プロダクション環境のシードデータを投入中...')
    
    // 本番環境であることを確認
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  本番環境でのシードデータ投入を開始します...')
    }
    
    await seedDatabase()
    
    console.log('✅ プロダクション環境のシードデータ投入が完了しました！')
    process.exit(0)
  } catch (error) {
    console.error('❌ シードデータ投入中にエラーが発生しました:', error)
    process.exit(1)
  }
}

main()