#!/bin/bash

echo "🔍 ローカル最適化API テスト開始"

# テストデータ
CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")

echo "📅 テスト日時: $CURRENT_DATE"

# ローカル環境でのテスト
echo "🚀 ローカル最適化APIテスト..."
curl -X POST "http://localhost:3000/api/meal-plan/generate-optimized" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"demo-user\",
    \"weekStartDate\": \"$CURRENT_DATE\",
    \"considerSeasonality\": true,
    \"avoidRecentMeals\": true,
    \"recentMealsDays\": 14,
    \"includeVariety\": true,
    \"maxSameCategoryPerWeek\": 2
  }" \
  -w "\n\n⏱️ Response Time: %{time_total}s\n📊 HTTP Status: %{http_code}\n" \
  -s

echo -e "\n\n🎯 テスト完了"