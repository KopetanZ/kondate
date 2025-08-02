-- 完全なSupabaseデータベースセットアップSQL
-- 既存のusersテーブルがある場合は、このSQLの該当部分をスキップしてください

-- Users table (既に作成済みの場合はスキップ)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    "familyName" TEXT UNIQUE NOT NULL,
    "familyIcon" TEXT NOT NULL,
    password TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- User preferences table (既に作成済みの場合はスキップ)
CREATE TABLE IF NOT EXISTS user_preferences (
    id TEXT PRIMARY KEY,
    "userId" TEXT UNIQUE NOT NULL,
    "familySize" INTEGER DEFAULT 2,
    "hasChildren" BOOLEAN DEFAULT false,
    "hasElderly" BOOLEAN DEFAULT false,
    "allowsCurryTwoDays" BOOLEAN DEFAULT true,
    "eatsBreakfastBread" BOOLEAN DEFAULT true,
    "eatsGranolaOrCereal" BOOLEAN DEFAULT false,
    "wantsRestDays" BOOLEAN DEFAULT true,
    "usesFrozenFoods" BOOLEAN DEFAULT true,
    "usesPreparedFoods" BOOLEAN DEFAULT true,
    allergies TEXT DEFAULT '[]',
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    unit TEXT DEFAULT 'g',
    "nutritionPer100g" TEXT NOT NULL,
    "peakSeasons" TEXT DEFAULT '[]',
    "storageType" TEXT DEFAULT 'pantry',
    "shelfLife" INTEGER DEFAULT 7,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    "cookingTime" INTEGER NOT NULL,
    difficulty INTEGER NOT NULL,
    servings INTEGER NOT NULL,
    instructions TEXT NOT NULL,
    nutrition TEXT NOT NULL,
    seasonality TEXT DEFAULT '[]',
    tags TEXT DEFAULT '[]',
    "userRating" REAL,
    "familyRating" REAL,
    notes TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES users(id)
);

-- Recipe ingredients table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id TEXT PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    quantity REAL NOT NULL,
    unit TEXT NOT NULL,
    FOREIGN KEY ("recipeId") REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY ("ingredientId") REFERENCES ingredients(id),
    UNIQUE("recipeId", "ingredientId")
);

-- Meal plans table
CREATE TABLE IF NOT EXISTS meal_plans (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    "breakfastId" TEXT,
    "lunchId" TEXT,
    "dinnerId" TEXT,
    "isGenerated" BOOLEAN DEFAULT false,
    "generationSettings" TEXT,
    "userRating" REAL,
    "familyFeedback" TEXT,
    notes TEXT,
    "weeklyMealPlanId" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY ("breakfastId") REFERENCES recipes(id),
    FOREIGN KEY ("lunchId") REFERENCES recipes(id),
    FOREIGN KEY ("dinnerId") REFERENCES recipes(id),
    UNIQUE("userId", date)
);

-- Weekly meal plans table
CREATE TABLE IF NOT EXISTS weekly_meal_plans (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "weekStartDate" TIMESTAMP NOT NULL,
    "totalNutrition" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE("userId", "weekStartDate")
);

-- Shopping lists table
CREATE TABLE IF NOT EXISTS shopping_lists (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    name TEXT NOT NULL,
    "weekStartDate" TIMESTAMP NOT NULL,
    "isCompleted" BOOLEAN DEFAULT false,
    "weeklyMealPlanId" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY ("weeklyMealPlanId") REFERENCES weekly_meal_plans(id)
);

-- Shopping items table
CREATE TABLE IF NOT EXISTS shopping_items (
    id TEXT PRIMARY KEY,
    "shoppingListId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    quantity REAL NOT NULL,
    unit TEXT NOT NULL,
    "isPurchased" BOOLEAN DEFAULT false,
    "estimatedPrice" REAL,
    "actualPrice" REAL,
    store TEXT,
    notes TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("shoppingListId") REFERENCES shopping_lists(id) ON DELETE CASCADE,
    FOREIGN KEY ("ingredientId") REFERENCES ingredients(id)
);

-- Nutrition targets table
CREATE TABLE IF NOT EXISTS nutrition_targets (
    "userId" TEXT PRIMARY KEY,
    "dailyCalories" REAL NOT NULL,
    "dailyProtein" REAL NOT NULL,
    "dailyFat" REAL NOT NULL,
    "dailyCarbohydrates" REAL NOT NULL,
    "dailyFiber" REAL NOT NULL,
    "dailySodium" REAL NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Seasonal produce table
CREATE TABLE IF NOT EXISTS seasonal_produce (
    id TEXT PRIMARY KEY,
    "ingredientId" TEXT NOT NULL,
    season TEXT NOT NULL,
    "peakMonth" INTEGER NOT NULL,
    description TEXT,
    "nutritionalBenefits" TEXT,
    "cookingTips" TEXT,
    FOREIGN KEY ("ingredientId") REFERENCES ingredients(id),
    UNIQUE("ingredientId", season)
);

-- サンプルデータの投入
-- 基本的な食材を追加
INSERT INTO ingredients (id, name, category, "nutritionPer100g", "peakSeasons") VALUES
('ing1', '米', 'grains', '{"calories": 356, "protein": 6.1, "fat": 0.9, "carbs": 77.6}', '["autumn"]'),
('ing2', '鶏肉', 'meat', '{"calories": 200, "protein": 23.3, "fat": 11.6, "carbs": 0}', '[]'),
('ing3', '豚肉', 'meat', '{"calories": 263, "protein": 17.1, "fat": 21.1, "carbs": 0.3}', '[]'),
('ing4', '玉ねぎ', 'vegetables', '{"calories": 37, "protein": 1.0, "fat": 0.1, "carbs": 8.8}', '["spring", "autumn"]'),
('ing5', 'にんじん', 'vegetables', '{"calories": 39, "protein": 0.7, "fat": 0.2, "carbs": 9.3}', '["winter"]'),
('ing6', 'じゃがいも', 'vegetables', '{"calories": 76, "protein": 1.6, "fat": 0.1, "carbs": 17.6}', '["autumn"]'),
('ing7', 'キャベツ', 'vegetables', '{"calories": 23, "protein": 1.3, "fat": 0.2, "carbs": 5.2}', '["winter", "spring"]'),
('ing8', '卵', 'dairy', '{"calories": 151, "protein": 12.3, "fat": 10.3, "carbs": 0.3}', '[]'),
('ing9', '醤油', 'seasonings', '{"calories": 71, "protein": 10.1, "fat": 0, "carbs": 7.8}', '[]'),
('ing10', '味噌', 'seasonings', '{"calories": 217, "protein": 12.9, "fat": 6.0, "carbs": 23.5}', '[]')
ON CONFLICT (id) DO NOTHING;

-- サンプルレシピを追加
INSERT INTO recipes (id, name, category, "cookingTime", difficulty, servings, instructions, nutrition, tags) VALUES
('recipe1', '親子丼', 'dinner', 20, 2, 2, '["鶏肉を切る", "玉ねぎをスライス", "だし汁で煮る", "卵でとじる", "ご飯にのせる"]', '{"calories": 650, "protein": 35, "fat": 15, "carbs": 85}', '["和食", "丼物"]'),
('recipe2', '野菜炒め', 'dinner', 15, 1, 3, '["野菜を切る", "フライパンで炒める", "調味料で味付け"]', '{"calories": 180, "protein": 8, "fat": 12, "carbs": 15}', '["中華", "野菜"]'),
('recipe3', 'カレーライス', 'dinner', 45, 2, 4, '["野菜と肉を切る", "炒める", "水を加えて煮込む", "カレールーを加える", "ご飯にかける"]', '{"calories": 850, "protein": 25, "fat": 20, "carbs": 120}', '["洋食", "カレー"]'),
('recipe4', '味噌汁', 'lunch', 10, 1, 4, '["だしを取る", "味噌を溶く", "具材を加える"]', '{"calories": 35, "protein": 2, "fat": 1, "carbs": 4}', '["和食", "汁物"]'),
('recipe5', '目玉焼き', 'breakfast', 5, 1, 1, '["フライパンを熱する", "卵を割り入れる", "好みの焼き加減まで焼く"]', '{"calories": 180, "protein": 13, "fat": 13, "carbs": 1}', '["洋食", "卵料理"]')
ON CONFLICT (id) DO NOTHING;

-- レシピと食材の関連を追加
INSERT INTO recipe_ingredients (id, "recipeId", "ingredientId", quantity, unit) VALUES
('ri1', 'recipe1', 'ing1', 150, 'g'),
('ri2', 'recipe1', 'ing2', 100, 'g'),
('ri3', 'recipe1', 'ing4', 50, 'g'),
('ri4', 'recipe1', 'ing8', 2, '個'),
('ri5', 'recipe2', 'ing5', 100, 'g'),
('ri6', 'recipe2', 'ing7', 150, 'g'),
('ri7', 'recipe2', 'ing4', 80, 'g'),
('ri8', 'recipe3', 'ing1', 200, 'g'),
('ri9', 'recipe3', 'ing3', 150, 'g'),
('ri10', 'recipe3', 'ing4', 100, 'g'),
('ri11', 'recipe3', 'ing5', 80, 'g'),
('ri12', 'recipe3', 'ing6', 150, 'g'),
('ri13', 'recipe4', 'ing10', 30, 'g'),
('ri14', 'recipe5', 'ing8', 2, '個')
ON CONFLICT (id) DO NOTHING;

-- 既存ユーザーが存在しない場合はサンプルユーザーを追加
INSERT INTO users (id, "familyName", "familyIcon", password, "createdAt", "updatedAt") VALUES
('user1', '田中家', '🏠', '["🍎","🍌","🍊","🍇"]', NOW(), NOW()),
('user2', '佐藤家', '🏡', '["🍖","🐟","🍳","🧀"]', NOW(), NOW()),
('user3', '鈴木家', '🌟', '["⚽","🎾","🏀","🎱"]', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;