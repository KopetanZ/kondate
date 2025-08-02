// ユーザー設定の型定義
export interface UserPreferences {
  id: string;
  userId: string;
  // 基本設定
  familySize: number;
  hasChildren: boolean;
  hasElderly: boolean;
  // 食事スタイル
  allowsCurryTwoDays: boolean;
  eatsBreakfastBread: boolean;
  eatsGranolaOrCereal: boolean;
  wantsRestDays: boolean;
  usesFrozenFoods: boolean;
  usesPreparedFoods: boolean;
  // アレルギー情報
  allergies: string[];
  // 作成・更新日時
  createdAt: Date;
  updatedAt: Date;
}

// 料理・レシピの型定義
export interface Recipe {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  cookingTime: number; // 分
  difficulty: 1 | 2 | 3 | 4 | 5;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  // 栄養情報
  nutrition: NutritionInfo;
  // 季節性
  seasonality: Season[];
  // タグ
  tags: string[];
  // 評価情報
  userRating?: number;
  familyRating?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 食材の型定義
export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  unit: string;
  quantity: number;
  // 栄養情報
  nutritionPer100g: NutritionInfo;
  // 季節性
  peakSeasons: Season[];
  // 保存情報
  storageType: 'refrigerated' | 'frozen' | 'pantry';
  shelfLife: number; // 日数
  createdAt: Date;
  updatedAt: Date;
}

// 食材カテゴリー
export type IngredientCategory = 
  | 'vegetables'
  | 'fruits'
  | 'meat'
  | 'fish'
  | 'dairy'
  | 'grains'
  | 'legumes'
  | 'seasonings'
  | 'oils'
  | 'others';

// 栄養情報
export interface NutritionInfo {
  calories: number;
  protein: number; // g
  fat: number; // g
  carbohydrates: number; // g
  fiber: number; // g
  sodium: number; // mg
  calcium: number; // mg
  iron: number; // mg
  vitaminC: number; // mg
}

// 季節
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

// 献立の型定義
export interface MealPlan {
  id: string;
  userId: string;
  date: Date;
  meals: {
    breakfast?: Recipe;
    lunch?: Recipe;
    dinner?: Recipe;
    snacks?: Recipe[];
  };
  // 生成情報
  isGenerated: boolean;
  generationSettings?: MealGenerationSettings;
  // ユーザー評価
  userRating?: number;
  familyFeedback?: FamilyFeedback[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 献立生成設定
export interface MealGenerationSettings {
  considerSeasonality: boolean;
  avoidRecentMeals: boolean;
  recentMealsDays: number;
  includeVariety: boolean;
  maxSameCategoryPerWeek: number;
  preferredCookingTime?: number;
  preferredDifficulty?: number;
}

// 家族の反応・評価
export interface FamilyFeedback {
  memberName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comments?: string;
}

// 買い物リスト
export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  weekStartDate: Date;
  items: ShoppingItem[];
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 買い物リストアイテム
export interface ShoppingItem {
  id: string;
  ingredient: Ingredient;
  quantity: number;
  unit: string;
  category: IngredientCategory;
  isPurchased: boolean;
  estimatedPrice?: number;
  actualPrice?: number;
  store?: string;
  notes?: string;
}

// 週間献立
export interface WeeklyMealPlan {
  id: string;
  userId: string;
  weekStartDate: Date;
  dailyPlans: MealPlan[];
  shoppingList?: ShoppingList;
  totalNutrition: NutritionInfo;
  createdAt: Date;
  updatedAt: Date;
}

// 栄養目標
export interface NutritionTarget {
  userId: string;
  dailyCalories: number;
  dailyProtein: number;
  dailyFat: number;
  dailyCarbohydrates: number;
  dailyFiber: number;
  dailySodium: number;
  updatedAt: Date;
}

// 旬の食材情報
export interface SeasonalProduce {
  id: string;
  ingredient: Ingredient;
  season: Season;
  peakMonth: number; // 1-12
  description?: string;
  nutritionalBenefits?: string;
  cookingTips?: string;
}

// API レスポンス型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ページネーション
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}