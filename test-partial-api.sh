#!/bin/bash

echo "🔍 部分的献立生成API テスト開始"

# テストデータ
CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")

echo "📅 テスト日時: $CURRENT_DATE"

# 朝食のみ生成テスト
echo "🌅 朝食のみ生成テスト..."
curl -X POST "http://localhost:3000/api/meal-plan/generate-partial" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"demo-user\",
    \"weekStartDate\": \"$CURRENT_DATE\",
    \"mealType\": \"breakfast\",
    \"considerSeasonality\": true,
    \"avoidRecentMeals\": true,
    \"recentMealsDays\": 14
  }" \
  -w "\n\n⏱️ Response Time: %{time_total}s\n📊 HTTP Status: %{http_code}\n" \
  -s

echo -e "\n\n🌃 夕食のみ生成テスト..."
curl -X POST "http://localhost:3000/api/meal-plan/generate-partial" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"demo-user\",
    \"weekStartDate\": \"$CURRENT_DATE\",
    \"mealType\": \"dinner\",
    \"considerSeasonality\": true,
    \"avoidRecentMeals\": true,
    \"recentMealsDays\": 14
  }" \
  -w "\n\n⏱️ Response Time: %{time_total}s\n📊 HTTP Status: %{http_code}\n" \
  -s

echo -e "\n\n🎯 テスト完了"