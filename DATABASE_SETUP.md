# データベースセットアップガイド

## Supabaseデータベース設定

### 1. Supabaseプロジェクトの設定確認

**重要なチェックポイント:**

1. **プロジェクトが一時停止されていないか**
   - Supabaseダッシュボードでプロジェクトが `Active` 状態であることを確認
   - 無料プランでは非活動時に自動的に一時停止される場合があります

2. **ネットワーク設定の確認**
   - Database > Settings > Connection pooling が有効であることを確認
   - Port 5432（直接接続）または 6543（プール接続）が利用可能であることを確認

3. **接続文字列の形式**
   ```
   # 直接接続（マイグレーション用）
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

   # プール接続（アプリケーション用、推奨）
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
   ```

### 2. Vercel環境変数の設定

Vercelダッシュボードで以下の環境変数を設定：

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
```

### 3. デプロイ後の手動データベース初期化

ビルド時にデータベース接続ができない場合は、デプロイ後に手動で初期化：

1. **ヘルスチェック**: `GET /api/health`
2. **データベース初期化**: `POST /api/setup`

### 4. トラブルシューティング

#### 接続エラー (P1001)
- Supabaseプロジェクトが停止していないか確認
- 接続文字列の形式を確認
- プール接続（port 6543）を使用

#### テーブルが存在しないエラー
- Supabaseダッシュボードの SQL Editor で手動実行：
  ```sql
  -- Prismaスキーマに基づいてテーブルを作成
  -- 詳細はprisma/schema.prismaを参照
  ```

#### 接続制限エラー
- 接続文字列に `?connection_limit=1` を追加
- プール接続を使用（pgbouncer=true）

### 5. 代替デプロイ方法

**Option A: ローカルマイグレーション**
```bash
# ローカルで実行
npx prisma db push --accept-data-loss
npx tsx scripts/seed-users.ts
```

**Option B: マニュアルSQL実行**
Supabase SQL Editorで直接テーブルを作成し、サンプルデータを挿入

### サポート

問題が継続する場合は、以下の情報を提供してください：
- `/api/health` のレスポンス
- Vercelファンクションログのエラーメッセージ
- Supabaseプロジェクトの状態