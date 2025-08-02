# 献立プランナーアプリ

## 概要

日本の家庭向けの献立自動生成・管理アプリケーションです。季節の食材を考慮し、ユーザーの好みや家族構成に基づいて1週間の献立を自動生成し、買い物リストも作成できます。

## 主な機能

- **ユーザー個別設定**: 家族構成、食事スタイル、アレルギー情報の管理
- **献立自動生成**: 季節・旬・ユーザー設定を考慮した週間献立の生成
- **カレンダー表示**: 週間献立を見やすいカレンダー形式で表示
- **買い物リスト生成**: 献立から必要な食材を自動計算・カテゴリ別整理
- **レスポンシブデザイン**: モバイル・デスクトップ対応

## 技術スタック

- **Frontend**: Next.js 15.4.5, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: shadcn/ui
- **Deployment**: Vercel

## ローカル開発環境のセットアップ

### 前提条件

- Node.js 18+ 
- PostgreSQL（またはSupabaseアカウント）

### インストール手順

1. リポジトリをクローン
```bash
git clone <repository-url>
cd meal-planner-app
```

2. 依存関数をインストール
```bash
npm install
```

3. 環境変数を設定
```bash
cp .env.example .env
```

`.env`ファイルを編集して以下を設定：
```
DATABASE_URL="postgresql://username:password@localhost:5432/meal_planner_db"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. データベースマイグレーション
```bash
npx prisma migrate dev --name init
```

5. シードデータを投入
```bash
npm run seed
```

6. 開発サーバーを起動
```bash
npm run dev
```

アプリケーションは http://localhost:3000 で利用できます。

## Vercelデプロイ手順

### 1. データベースの準備

#### Supabase（推奨）
1. [Supabase](https://supabase.com/)でアカウント作成
2. 新しいプロジェクト作成  
3. Settings > Database > Connection string をコピー

#### 他のPostgreSQLプロバイダー
- Railway
- PlanetScale  
- Neon
- Amazon RDS

### 2. Vercelでのデプロイ

1. [Vercel](https://vercel.com/)でアカウント作成

2. GitHubリポジトリをインポート

3. 環境変数を設定（Vercel Dashboard > Settings > Environment Variables）：
```
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_secure_random_string
NODE_ENV=production
```

4. デプロイ実行

### 3. データベースの初期化

デプロイ後、以下のコマンドでデータベースを初期化：

```bash
# ローカルで実行（本番DBに接続）
DATABASE_URL="your_production_db_url" npx prisma migrate deploy
DATABASE_URL="your_production_db_url" npm run seed
```

## プロジェクト構造

```
src/
├── app/
│   ├── api/          # API endpoints
│   │   ├── meal-plan/
│   │   ├── shopping-list/
│   │   └── user/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   ├── MealPlannerDashboard.tsx
│   ├── ShoppingList.tsx
│   └── UserSetup.tsx
├── lib/             # Utility functions
│   ├── db.ts
│   ├── meal-generator.ts
│   └── seed-data.ts
└── types/           # TypeScript type definitions
    └── index.ts
prisma/
├── schema.prisma    # Database schema
└── migrations/      # Database migrations
```

## API エンドポイント

### ユーザー設定
- `GET /api/user/preferences` - ユーザー設定取得
- `POST /api/user/preferences` - ユーザー設定保存

### 献立管理  
- `GET /api/meal-plan` - 献立取得
- `POST /api/meal-plan/generate` - 献立自動生成
- `PUT /api/meal-plan` - 献立更新

### 買い物リスト
- `GET /api/shopping-list` - 買い物リスト取得
- `POST /api/shopping-list/generate` - 買い物リスト生成
- `PUT /api/shopping-list` - 買い物リスト更新

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プロダクションサーバー起動  
npm start

# リンター実行
npm run lint

# データベース関連
npm run db:generate    # Prisma client生成
npm run db:push       # スキーマをDBにプッシュ
npm run db:migrate    # マイグレーション実行
npm run seed          # シードデータ投入
```

## ライセンス

MIT License

## 貢献

プルリクエストやIssueを歓迎します。

## サポート

問題や質問がある場合は、GitHubのIssuesをご利用ください。
