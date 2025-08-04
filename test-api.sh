#!/bin/bash

echo "🔍 最適化API テスト開始"

# テストデータ
CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")

echo "📅 テスト日時: $CURRENT_DATE"

# 本番環境でのテスト
echo "🚀 最適化APIテスト..."
curl -X POST "https://kondate-git-main-kopetanzs-projects.vercel.app/api/meal-plan/generate-optimized" \
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