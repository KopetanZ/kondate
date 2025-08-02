-- 包括的な日本料理レシピとサンプルデータベース
-- 朝食30個、昼食30個、夕食40個のレシピと食材データを追加

-- 既存データをクリア
DELETE FROM recipe_ingredients;
DELETE FROM recipes;
DELETE FROM ingredients;

-- 詳細な食材データベース（50個以上の食材）
INSERT INTO ingredients (id, name, category, "nutritionPer100g", "peakSeasons", "storageType", "shelfLife") VALUES
-- 穀物類
('ing_rice', '米', 'grains', '{"calories": 130, "protein": 2.7, "fat": 0.3, "carbs": 28}', '["通年"]', 'pantry', 365),
('ing_bread', 'パン', 'grains', '{"calories": 264, "protein": 9, "fat": 3.2, "carbs": 50}', '["通年"]', 'pantry', 5),
('ing_udon', 'うどん', 'grains', '{"calories": 270, "protein": 6.9, "fat": 0.8, "carbs": 56}', '["通年"]', 'pantry', 30),
('ing_soba', 'そば', 'grains', '{"calories": 296, "protein": 9.6, "fat": 1.9, "carbs": 63}', '["通年"]', 'pantry', 30),
('ing_ramen', 'ラーメン', 'grains', '{"calories": 281, "protein": 9.5, "fat": 1.5, "carbs": 57}', '["通年"]', 'pantry', 90),

-- 肉類
('ing_chicken', '鶏肉', 'meat', '{"calories": 200, "protein": 18.8, "fat": 11.6, "carbs": 0}', '["通年"]', 'refrigerated', 3),
('ing_pork', '豚肉', 'meat', '{"calories": 263, "protein": 17.1, "fat": 21.1, "carbs": 0.3}', '["通年"]', 'refrigerated', 3),
('ing_beef', '牛肉', 'meat', '{"calories": 259, "protein": 17.1, "fat": 19.5, "carbs": 0.3}', '["通年"]', 'refrigerated', 3),
('ing_ground_pork', '豚ひき肉', 'meat', '{"calories": 221, "protein": 18.6, "fat": 15.1, "carbs": 0}', '["通年"]', 'refrigerated', 2),

-- 魚類・海産物
('ing_salmon', '鮭', 'fish', '{"calories": 206, "protein": 22, "fat": 12, "carbs": 0}', '["秋", "冬"]', 'refrigerated', 3),
('ing_mackerel', '鯖', 'fish', '{"calories": 247, "protein": 20.7, "fat": 16.8, "carbs": 0.3}', '["秋", "冬"]', 'refrigerated', 3),
('ing_tuna', 'まぐろ', 'fish', '{"calories": 125, "protein": 26.4, "fat": 1.4, "carbs": 0.1}', '["通年"]', 'refrigerated', 2),
('ing_sea_bream', '鯛', 'fish', '{"calories": 142, "protein": 20.6, "fat": 5.8, "carbs": 0.1}', '["春"]', 'refrigerated', 2),

-- 野菜類
('ing_onion', '玉ねぎ', 'vegetables', '{"calories": 37, "protein": 1.0, "fat": 0.1, "carbs": 8.8}', '["春", "秋"]', 'pantry', 30),
('ing_carrot', 'にんじん', 'vegetables', '{"calories": 39, "protein": 0.7, "fat": 0.2, "carbs": 9.3}', '["冬"]', 'refrigerated', 14),
('ing_potato', 'じゃがいも', 'vegetables', '{"calories": 76, "protein": 1.6, "fat": 0.1, "carbs": 17.6}', '["秋"]', 'pantry', 60),
('ing_cabbage', 'キャベツ', 'vegetables', '{"calories": 23, "protein": 1.3, "fat": 0.2, "carbs": 5.2}', '["春", "冬"]', 'refrigerated', 14),
('ing_daikon', '大根', 'vegetables', '{"calories": 18, "protein": 0.6, "fat": 0.1, "carbs": 4.1}', '["冬"]', 'refrigerated', 14),
('ing_spinach', 'ほうれん草', 'vegetables', '{"calories": 20, "protein": 2.2, "fat": 0.4, "carbs": 3.1}', '["冬"]', 'refrigerated', 5),
('ing_negi', 'ネギ', 'vegetables', '{"calories": 28, "protein": 1.4, "fat": 0.1, "carbs": 7.2}', '["冬"]', 'refrigerated', 10),
('ing_tomato', 'トマト', 'vegetables', '{"calories": 19, "protein": 0.7, "fat": 0.1, "carbs": 4.7}', '["夏"]', 'refrigerated', 7),
('ing_cucumber', 'きゅうり', 'vegetables', '{"calories": 14, "protein": 1.0, "fat": 0.1, "carbs": 3.0}', '["夏"]', 'refrigerated', 7),
('ing_eggplant', 'ナス', 'vegetables', '{"calories": 22, "protein": 1.1, "fat": 0.1, "carbs": 5.1}', '["夏"]', 'refrigerated', 7),
('ing_green_pepper', 'ピーマン', 'vegetables', '{"calories": 22, "protein": 0.9, "fat": 0.2, "carbs": 5.1}', '["夏"]', 'refrigerated', 7),

-- 卵・乳製品
('ing_egg', '卵', 'dairy', '{"calories": 151, "protein": 12.3, "fat": 10.3, "carbs": 0.3}', '["通年"]', 'refrigerated', 21),
('ing_tofu', '豆腐', 'dairy', '{"calories": 76, "protein": 8.2, "fat": 4.8, "carbs": 1.9}', '["通年"]', 'refrigerated', 7),
('ing_aburaage', '油揚げ', 'dairy', '{"calories": 386, "protein": 18.6, "fat": 33.1, "carbs": 3.6}', '["通年"]', 'refrigerated', 7),

-- 調味料・香味料
('ing_soy_sauce', '醤油', 'seasonings', '{"calories": 71, "protein": 10.5, "fat": 0, "carbs": 7.8}', '["通年"]', 'pantry', 730),
('ing_miso', '味噌', 'seasonings', '{"calories": 217, "protein": 13.4, "fat": 6, "carbs": 20.2}', '["通年"]', 'refrigerated', 365),
('ing_mirin', 'みりん', 'seasonings', '{"calories": 241, "protein": 0.1, "fat": 0, "carbs": 43.2}', '["通年"]', 'pantry', 365),
('ing_sake', '酒', 'seasonings', '{"calories": 103, "protein": 0.4, "fat": 0, "carbs": 4.9}', '["通年"]', 'pantry', 365),
('ing_sugar', '砂糖', 'seasonings', '{"calories": 384, "protein": 0, "fat": 0, "carbs": 99.2}', '["通年"]', 'pantry', 730),
('ing_salt', '塩', 'seasonings', '{"calories": 0, "protein": 0, "fat": 0, "carbs": 0}', '["通年"]', 'pantry', 3650),
('ing_ginger', '生姜', 'seasonings', '{"calories": 30, "protein": 0.9, "fat": 0.3, "carbs": 6.6}', '["通年"]', 'refrigerated', 14),
('ing_garlic', 'にんにく', 'seasonings', '{"calories": 136, "protein": 6.0, "fat": 1.3, "carbs": 26.3}', '["通年"]', 'pantry', 30),

-- 海藻・乾物
('ing_wakame', 'わかめ', 'others', '{"calories": 16, "protein": 1.9, "fat": 0.2, "carbs": 5.6}', '["春"]', 'pantry', 730),
('ing_kombu', '昆布', 'others', '{"calories": 138, "protein": 8.2, "fat": 1.2, "carbs": 27.1}', '["通年"]', 'pantry', 730),
('ing_nori', '海苔', 'others', '{"calories": 173, "protein": 29.4, "fat": 3.7, "carbs": 25.8}', '["通年"]', 'pantry', 365),

-- 調理油・その他
('ing_oil', '植物油', 'oils', '{"calories": 921, "protein": 0, "fat": 100, "carbs": 0}', '["通年"]', 'pantry', 365),
('ing_sesame_oil', 'ごま油', 'oils', '{"calories": 921, "protein": 0, "fat": 100, "carbs": 0}', '["通年"]', 'pantry', 365),

-- 追加の野菜類（季節野菜を含む）
('ing_broccoli', 'ブロッコリー', 'vegetables', '{"calories": 33, "protein": 4.3, "fat": 0.5, "carbs": 5.2}', '["冬"]', 'refrigerated', 7),
('ing_asparagus', 'アスパラガス', 'vegetables', '{"calories": 22, "protein": 2.6, "fat": 0.2, "carbs": 3.9}', '["春"]', 'refrigerated', 5),
('ing_bamboo_shoots', 'たけのこ', 'vegetables', '{"calories": 26, "protein": 3.6, "fat": 0.2, "carbs": 4.3}', '["春"]', 'refrigerated', 3),
('ing_sweet_potato', 'さつまいも', 'vegetables', '{"calories": 132, "protein": 1.2, "fat": 0.2, "carbs": 31.5}', '["秋"]', 'pantry', 14),
('ing_pumpkin', 'かぼちゃ', 'vegetables', '{"calories": 91, "protein": 1.9, "fat": 0.3, "carbs": 20.6}', '["秋"]', 'pantry', 30),
('ing_corn', 'とうもろこし', 'vegetables', '{"calories": 92, "protein": 3.6, "fat": 1.7, "carbs": 16.8}', '["夏"]', 'refrigerated', 3),
('ing_okra', 'オクラ', 'vegetables', '{"calories": 30, "protein": 2.1, "fat": 0.2, "carbs": 6.6}', '["夏"]', 'refrigerated', 5),
('ing_lotus_root', 'れんこん', 'vegetables', '{"calories": 66, "protein": 1.9, "fat": 0.1, "carbs": 15.5}', '["秋", "冬"]', 'refrigerated', 10),
('ing_chinese_cabbage', '白菜', 'vegetables', '{"calories": 14, "protein": 0.8, "fat": 0.1, "carbs": 3.2}', '["冬"]', 'refrigerated', 14),
('ing_shiitake', 'しいたけ', 'vegetables', '{"calories": 18, "protein": 3.0, "fat": 0.4, "carbs": 2.5}', '["秋"]', 'refrigerated', 7),
('ing_shimeji', 'しめじ', 'vegetables', '{"calories": 18, "protein": 2.7, "fat": 0.3, "carbs": 3.7}', '["秋"]', 'refrigerated', 7),
('ing_enoki', 'えのき', 'vegetables', '{"calories": 22, "protein": 2.7, "fat": 0.2, "carbs": 3.7}', '["通年"]', 'refrigerated', 7),
('ing_bean_sprouts', 'もやし', 'vegetables', '{"calories": 14, "protein": 1.7, "fat": 0.1, "carbs": 2.6}', '["通年"]', 'refrigerated', 3),
('ing_edamame', '枝豆', 'vegetables', '{"calories": 135, "protein": 11.7, "fat": 6.2, "carbs": 8.8}', '["夏"]', 'frozen', 365),
('ing_green_beans', 'いんげん', 'vegetables', '{"calories": 23, "protein": 1.8, "fat": 0.1, "carbs": 4.8}', '["夏"]', 'refrigerated', 7),
('ing_snap_peas', 'スナップエンドウ', 'vegetables', '{"calories": 43, "protein": 3.1, "fat": 0.2, "carbs": 7.5}', '["春"]', 'refrigerated', 5),

-- 追加の魚類・海産物
('ing_yellowtail', 'ぶり', 'fish', '{"calories": 257, "protein": 21.4, "fat": 17.6, "carbs": 0.3}', '["冬"]', 'refrigerated', 2),
('ing_sea_bass', 'すずき', 'fish', '{"calories": 123, "protein": 20.0, "fat": 4.2, "carbs": 0.1}', '["夏"]', 'refrigerated', 2),
('ing_horse_mackerel', 'アジ', 'fish', '{"calories": 121, "protein": 20.7, "fat": 4.5, "carbs": 0.1}', '["夏"]', 'refrigerated', 2),
('ing_sardine', 'いわし', 'fish', '{"calories": 217, "protein": 19.8, "fat": 13.9, "carbs": 0.7}', '["秋"]', 'refrigerated', 2),
('ing_saury', 'さんま', 'fish', '{"calories": 310, "protein": 18.5, "fat": 24.6, "carbs": 0.1}', '["秋"]', 'refrigerated', 2),
('ing_shrimp', 'エビ', 'fish', '{"calories": 83, "protein": 18.4, "fat": 0.6, "carbs": 0.1}', '["通年"]', 'frozen', 90),
('ing_squid', 'イカ', 'fish', '{"calories": 88, "protein": 18.1, "fat": 1.2, "carbs": 0.2}', '["通年"]', 'refrigerated', 2),
('ing_octopus', 'タコ', 'fish', '{"calories": 96, "protein": 16.4, "fat": 1.2, "carbs": 3.1}', '["夏"]', 'refrigerated', 2),
('ing_scallop', 'ホタテ', 'fish', '{"calories": 72, "protein": 13.5, "fat": 0.9, "carbs": 1.5}', '["冬"]', 'frozen', 90),

-- 追加の肉類
('ing_chicken_thigh', '鶏もも肉', 'meat', '{"calories": 200, "protein": 16.2, "fat": 14.0, "carbs": 0}', '["通年"]', 'refrigerated', 3),
('ing_chicken_breast', '鶏むね肉', 'meat', '{"calories": 108, "protein": 22.3, "fat": 1.5, "carbs": 0}', '["通年"]', 'refrigerated', 3),
('ing_pork_belly', '豚バラ肉', 'meat', '{"calories": 386, "protein": 14.2, "fat": 34.6, "carbs": 0.1}', '["通年"]', 'refrigerated', 3),
('ing_pork_shoulder', '豚肩ロース', 'meat', '{"calories": 253, "protein": 17.1, "fat": 19.2, "carbs": 0.2}', '["通年"]', 'refrigerated', 3),
('ing_beef_sirloin', '牛サーロイン', 'meat', '{"calories": 298, "protein": 17.4, "fat": 23.7, "carbs": 0.4}', '["通年"]', 'refrigerated', 3),
('ing_beef_tenderloin', '牛ヒレ肉', 'meat', '{"calories": 133, "protein": 20.5, "fat": 4.8, "carbs": 0.3}', '["通年"]', 'refrigerated', 3),
('ing_ground_beef', '牛ひき肉', 'meat', '{"calories": 224, "protein": 19.0, "fat": 15.1, "carbs": 0.3}', '["通年"]', 'refrigerated', 2),
('ing_ground_chicken', '鶏ひき肉', 'meat', '{"calories": 166, "protein": 20.9, "fat": 8.3, "carbs": 0}', '["通年"]', 'refrigerated', 2),

-- 追加の大豆製品・乳製品
('ing_atsuage', '厚揚げ', 'dairy', '{"calories": 150, "protein": 10.7, "fat": 11.3, "carbs": 1.6}', '["通年"]', 'refrigerated', 5),
('ing_ganmodoki', 'がんもどき', 'dairy', '{"calories": 228, "protein": 15.3, "fat": 17.8, "carbs": 1.3}', '["通年"]', 'refrigerated', 5),
('ing_yuba', 'ゆば', 'dairy', '{"calories": 231, "protein": 21.8, "fat": 13.9, "carbs": 3.6}', '["通年"]', 'refrigerated', 3),
('ing_natto', '納豆', 'dairy', '{"calories": 200, "protein": 16.5, "fat": 10.0, "carbs": 12.1}', '["通年"]', 'refrigerated', 7),
('ing_butter', 'バター', 'dairy', '{"calories": 745, "protein": 0.6, "fat": 81.0, "carbs": 0.2}', '["通年"]', 'refrigerated', 14),
('ing_milk', '牛乳', 'dairy', '{"calories": 67, "protein": 3.3, "fat": 3.8, "carbs": 4.8}', '["通年"]', 'refrigerated', 7),
('ing_cheese', 'チーズ', 'dairy', '{"calories": 339, "protein": 22.7, "fat": 26.0, "carbs": 1.3}', '["通年"]', 'refrigerated', 30),

-- 追加の調味料・香辛料
('ing_vinegar', '酢', 'seasonings', '{"calories": 25, "protein": 0.1, "fat": 0, "carbs": 2.4}', '["通年"]', 'pantry', 730),
('ing_oyster_sauce', 'オイスターソース', 'seasonings', '{"calories": 107, "protein": 5.6, "fat": 0.5, "carbs": 18.0}', '["通年"]', 'pantry', 365),
('ing_worcestershire', 'ウスターソース', 'seasonings', '{"calories": 117, "protein": 1.7, "fat": 0, "carbs": 26.3}', '["通年"]', 'pantry', 365),
('ing_ketchup', 'ケチャップ', 'seasonings', '{"calories": 119, "protein": 1.7, "fat": 0.2, "carbs": 25.6}', '["通年"]', 'pantry', 365),
('ing_mayonnaise', 'マヨネーズ', 'seasonings', '{"calories": 703, "protein": 1.5, "fat": 75.3, "carbs": 4.5}', '["通年"]', 'refrigerated', 90),
('ing_sesame_seeds', 'ごま', 'seasonings', '{"calories": 578, "protein": 19.8, "fat": 51.1, "carbs": 18.4}', '["通年"]', 'pantry', 365),
('ing_curry_powder', 'カレー粉', 'seasonings', '{"calories": 415, "protein": 14.3, "fat": 13.8, "carbs": 41.9}', '["通年"]', 'pantry', 730),
('ing_seven_spice', '七味唐辛子', 'seasonings', '{"calories": 419, "protein": 14.7, "fat": 12.0, "carbs": 60.3}', '["通年"]', 'pantry', 365),
('ing_wasabi', 'わさび', 'seasonings', '{"calories": 265, "protein": 7.2, "fat": 0.2, "carbs": 62.0}', '["通年"]', 'refrigerated', 30),
('ing_ponzu', 'ポン酢', 'seasonings', '{"calories": 56, "protein": 3.6, "fat": 0, "carbs": 9.2}', '["通年"]', 'pantry', 365),

-- 追加の穀物・麺類
('ing_buckwheat_flour', 'そば粉', 'grains', '{"calories": 361, "protein": 12.0, "fat": 3.1, "carbs": 69.6}', '["通年"]', 'pantry', 365),
('ing_wheat_flour', '小麦粉', 'grains', '{"calories": 368, "protein": 8.3, "fat": 1.5, "carbs": 75.8}', '["通年"]', 'pantry', 365),
('ing_pasta', 'パスタ', 'grains', '{"calories": 378, "protein": 13.0, "fat": 2.5, "carbs": 72.2}', '["通年"]', 'pantry', 730),
('ing_mochi', '餅', 'grains', '{"calories": 235, "protein": 4.2, "fat": 0.8, "carbs": 50.3}', '["通年"]', 'pantry', 365),
('ing_breadcrumbs', 'パン粉', 'grains', '{"calories": 373, "protein": 14.6, "fat": 6.8, "carbs": 63.4}', '["通年"]', 'pantry', 90),

-- 海藻・乾物類の追加
('ing_hijiki', 'ひじき', 'others', '{"calories": 139, "protein": 9.2, "fat": 3.2, "carbs": 12.9}', '["通年"]', 'pantry', 730),
('ing_dried_shiitake', '干ししいたけ', 'others', '{"calories": 182, "protein": 13.4, "fat": 3.7, "carbs": 63.4}', '["通年"]', 'pantry', 365),
('ing_katsuobushi', 'かつお節', 'others', '{"calories": 356, "protein": 77.1, "fat": 2.9, "carbs": 0.8}', '["通年"]', 'pantry', 365),
('ing_konnyaku', 'こんにゃく', 'others', '{"calories": 5, "protein": 0.1, "fat": 0, "carbs": 2.3}', '["通年"]', 'refrigerated', 30),
('ing_shirataki', 'しらたき', 'others', '{"calories": 6, "protein": 0.2, "fat": 0, "carbs": 3.0}', '["通年"]', 'refrigerated', 14),

-- 果物類
('ing_lemon', 'レモン', 'fruits', '{"calories": 54, "protein": 0.9, "fat": 0.7, "carbs": 7.6}', '["通年"]', 'refrigerated', 14),
('ing_lime', 'ライム', 'fruits', '{"calories": 27, "protein": 0.8, "fat": 0.1, "carbs": 8.5}', '["通年"]', 'refrigerated', 14),
('ing_yuzu', 'ゆず', 'fruits', '{"calories": 21, "protein": 0.5, "fat": 0.1, "carbs": 7.0}', '["冬"]', 'refrigerated', 14),
('ing_apple', 'りんご', 'fruits', '{"calories": 61, "protein": 0.2, "fat": 0.3, "carbs": 16.2}', '["秋"]', 'refrigerated', 30),
('ing_persimmon', '柿', 'fruits', '{"calories": 60, "protein": 0.4, "fat": 0.2, "carbs": 15.9}', '["秋"]', 'refrigerated', 7),

-- 冷凍食品
('ing_frozen_mixed_vegetables', '冷凍ミックス野菜', 'vegetables', '{"calories": 79, "protein": 3.8, "fat": 0.3, "carbs": 17.6}', '["通年"]', 'frozen', 365),
('ing_frozen_gyoza', '冷凍餃子', 'others', '{"calories": 184, "protein": 8.2, "fat": 9.8, "carbs": 16.8}', '["通年"]', 'frozen', 365),
('ing_frozen_edamame', '冷凍枝豆', 'vegetables', '{"calories": 135, "protein": 11.7, "fat": 6.2, "carbs": 8.8}', '["通年"]', 'frozen', 365)
ON CONFLICT (id) DO NOTHING;

-- 朝食レシピ（30個）
INSERT INTO recipes (id, name, category, "cookingTime", difficulty, servings, instructions, nutrition, tags) VALUES
-- 基本的な朝食
('recipe_b01', 'たまごかけごはん', 'breakfast', 5, 1, 1, '["炊きたてのご飯を茶碗によそう", "生卵を割り入れる", "醤油を少量加える", "よく混ぜて完成"]', '{"calories": 350, "protein": 15, "fat": 8, "carbs": 58}', '["簡単", "定番", "卵料理"]'),
('recipe_b02', '目玉焼き', 'breakfast', 5, 1, 1, '["フライパンを熱し油をひく", "卵を割り入れる", "好みの焼き加減まで焼く", "塩こしょうで味付け"]', '{"calories": 180, "protein": 13, "fat": 13, "carbs": 1}', '["洋食", "卵料理"]'),
('recipe_b03', 'スクランブルエッグ', 'breakfast', 8, 1, 2, '["卵を溶いて塩こしょうする", "バターを溶かしたフライパンで炒める", "半熟状態で火を止める", "パンと一緒に盛る"]', '{"calories": 200, "protein": 14, "fat": 15, "carbs": 2}', '["洋食", "卵料理"]'),
('recipe_b04', 'オムレツ', 'breakfast', 10, 2, 1, '["卵を溶いて調味する", "フライパンで半月形に焼く", "具材があれば包む", "皿に盛り付ける"]', '{"calories": 280, "protein": 18, "fat": 20, "carbs": 8}', '["洋食", "卵料理"]'),
('recipe_b05', 'だし巻き卵', 'breakfast', 15, 3, 2, '["卵にだしと調味料を混ぜる", "卵焼き器を熱し油をひく", "卵液を数回に分けて焼く", "巻きながら形を整える"]', '{"calories": 120, "protein": 10, "fat": 8, "carbs": 2}', '["和食", "卵料理", "技術要"]'),

-- トースト系
('recipe_b06', 'トースト', 'breakfast', 3, 1, 1, '["パンをトースターで焼く", "バターを塗る", "好みでジャムを塗る"]', '{"calories": 250, "protein": 8, "fat": 10, "carbs": 35}', '["洋食", "パン"]'),
('recipe_b07', 'フレンチトースト', 'breakfast', 12, 2, 2, '["卵と牛乳で卵液を作る", "パンを浸す", "フライパンで両面を焼く", "メープルシロップをかける"]', '{"calories": 320, "protein": 12, "fat": 15, "carbs": 38}', '["洋食", "パン"]'),
('recipe_b08', 'サンドイッチ', 'breakfast', 10, 1, 2, '["パンに具材を挟む", "端を切り落とす", "食べやすくカットする"]', '{"calories": 320, "protein": 15, "fat": 12, "carbs": 40}', '["洋食", "パン"]'),

-- 和食系
('recipe_b09', '焼き鮭朝食', 'breakfast', 12, 2, 1, '["鮭に塩をふって下味をつける", "グリルまたはフライパンで焼く", "大根おろしを添える", "ご飯と味噌汁と一緒に"]', '{"calories": 450, "protein": 35, "fat": 12, "carbs": 45}', '["和食", "魚料理", "定食"]'),
('recipe_b10', '納豆ごはん', 'breakfast', 5, 1, 1, '["納豆をよく混ぜる", "醤油とからしを加える", "ご飯にのせる", "刻みねぎを散らす"]', '{"calories": 320, "protein": 18, "fat": 6, "carbs": 50}', '["和食", "発酵食品", "定番"]'),
('recipe_b11', 'おにぎり', 'breakfast', 10, 1, 2, '["温かいご飯に塩をまぶす", "具材を中央に置く", "三角形に握る", "海苔を巻いて完成"]', '{"calories": 180, "protein": 4, "fat": 1, "carbs": 38}', '["和食", "携帯食", "米料理"]'),
('recipe_b12', '味噌汁', 'breakfast', 10, 2, 2, '["だしを沸かす", "豆腐とわかめを加える", "味噌を溶き入れる", "ねぎを散らして完成"]', '{"calories": 45, "protein": 3, "fat": 2, "carbs": 4}', '["和食", "汁物", "発酵食品"]'),
('recipe_b13', '卵焼き', 'breakfast', 8, 2, 2, '["卵を溶いて砂糖と塩で調味", "卵焼き器で焼く", "巻きながら形を作る", "冷ましてからカット"]', '{"calories": 150, "protein": 12, "fat": 10, "carbs": 3}', '["和食", "卵料理"]'),
('recipe_b14', '茶碗蒸し', 'breakfast', 20, 3, 2, '["卵液を作る", "具材を器に入れる", "卵液を注ぐ", "蒸し器で蒸す"]', '{"calories": 120, "protein": 8, "fat": 6, "carbs": 8}', '["和食", "蒸し物"]'),

-- シリアル・乳製品系
('recipe_b15', 'グラノーラ', 'breakfast', 2, 1, 1, '["ボウルにグラノーラを入れる", "冷たい牛乳をかける", "フルーツを乗せる"]', '{"calories": 280, "protein": 8, "fat": 8, "carbs": 45}', '["洋食", "シリアル"]'),
('recipe_b16', 'ヨーグルト', 'breakfast', 2, 1, 1, '["ヨーグルトをボウルに入れる", "フルーツを乗せる", "はちみつをかける"]', '{"calories": 150, "protein": 8, "fat": 4, "carbs": 20}', '["洋食", "乳製品"]'),

-- パンケーキ・ホットケーキ系
('recipe_b17', 'パンケーキ', 'breakfast', 15, 2, 3, '["ホットケーキミックスで生地を作る", "フライパンで焼く", "メープルシロップをかける", "バターを乗せる"]', '{"calories": 350, "protein": 10, "fat": 12, "carbs": 50}', '["洋食", "パン"]'),
('recipe_b18', 'ホットケーキ', 'breakfast', 15, 2, 3, '["ミックス粉と卵、牛乳を混ぜる", "フライパンで片面ずつ焼く", "はちみつやシロップをかける"]', '{"calories": 340, "protein": 9, "fat": 11, "carbs": 52}', '["洋食", "甘味"]'),

-- その他の朝食
('recipe_b19', 'おかゆ', 'breakfast', 25, 1, 2, '["米を多めの水で炊く", "弱火でじっくり煮る", "塩で味付け", "梅干しや海苔を添える"]', '{"calories": 120, "protein": 2, "fat": 0.3, "carbs": 28}', '["和食", "体に優しい"]'),
('recipe_b20', '雑炊', 'breakfast', 15, 2, 2, '["だしを沸かす", "ご飯を加える", "卵を溶き入れる", "ねぎを散らす"]', '{"calories": 200, "protein": 8, "fat": 4, "carbs": 35}', '["和食", "温かい"]'),
('recipe_b21', 'バナナトースト', 'breakfast', 5, 1, 1, '["パンを焼く", "バナナをスライス", "パンに乗せる", "はちみつをかける"]', '{"calories": 280, "protein": 8, "fat": 6, "carbs": 52}', '["洋食", "フルーツ"]'),
('recipe_b22', 'アボカドトースト', 'breakfast', 8, 1, 1, '["パンを焼く", "アボカドを潰す", "塩こしょうで味付け", "パンに塗る"]', '{"calories": 320, "protein": 10, "fat": 18, "carbs": 32}', '["洋食", "健康的"]'),
('recipe_b23', 'チーズトースト', 'breakfast', 5, 1, 1, '["パンにチーズを乗せる", "トースターで焼く", "チーズが溶けるまで"]', '{"calories": 290, "protein": 12, "fat": 15, "carbs": 28}', '["洋食", "チーズ"]'),
('recipe_b24', '野菜スープ', 'breakfast', 20, 2, 2, '["野菜を小さく切る", "鍋で炒める", "水を加えて煮込む", "塩こしょうで味付け"]', '{"calories": 80, "protein": 3, "fat": 2, "carbs": 15}', '["洋食", "野菜", "温かい"]'),
('recipe_b25', 'コーンスープ', 'breakfast', 15, 2, 2, '["コーンを煮る", "ミキサーで攪拌", "牛乳を加える", "塩こしょうで味付け"]', '{"calories": 120, "protein": 4, "fat": 5, "carbs": 18}', '["洋食", "スープ"]'),
('recipe_b26', '具だくさん味噌汁', 'breakfast', 15, 2, 3, '["だしを取る", "根菜類を煮る", "豆腐と海藻を加える", "味噌を溶く"]', '{"calories": 80, "protein": 5, "fat": 3, "carbs": 8}', '["和食", "汁物", "野菜"]'),
('recipe_b27', '厚焼き玉子', 'breakfast', 12, 3, 2, '["卵を溶いて調味", "卵焼き器で厚く焼く", "形を整える", "冷ましてカット"]', '{"calories": 180, "protein": 14, "fat": 12, "carbs": 2}', '["和食", "卵料理"]'),
('recipe_b28', '焼きおにぎり', 'breakfast', 10, 2, 2, '["おにぎりを作る", "醤油を塗る", "フライパンで焼く", "香ばしくなるまで"]', '{"calories": 200, "protein": 4, "fat": 2, "carbs": 42}', '["和食", "焼き物"]'),
('recipe_b29', 'お茶漬け', 'breakfast', 5, 1, 1, '["ご飯を茶碗に盛る", "お茶漬けの素をかける", "熱いお茶を注ぐ", "海苔を散らす"]', '{"calories": 180, "protein": 4, "fat": 1, "carbs": 38}', '["和食", "簡単"]'),
('recipe_b30', 'しらす丼', 'breakfast', 5, 1, 1, '["ご飯を盛る", "しらすを乗せる", "大根おろしを添える", "醤油をかける"]', '{"calories": 280, "protein": 18, "fat": 3, "carbs": 45}', '["和食", "海鮮", "丼物"]'),

-- 昼食レシピ（30個）
('recipe_l01', '親子丼', 'lunch', 20, 2, 1, '["鶏肉を一口大に切る", "玉ねぎをスライス", "だし汁で煮る", "溶き卵でとじる", "ご飯にのせる"]', '{"calories": 580, "protein": 28, "fat": 12, "carbs": 85}', '["和食", "丼物", "鶏肉"]'),
('recipe_l02', 'カツ丼', 'lunch', 25, 3, 1, '["豚カツを揚げる", "玉ねぎをだしで煮る", "カツを加える", "卵でとじてご飯にのせる"]', '{"calories": 750, "protein": 32, "fat": 28, "carbs": 90}', '["和食", "丼物", "揚げ物"]'),
('recipe_l03', '天丼', 'lunch', 30, 3, 1, '["海老と野菜の天ぷらを揚げる", "天つゆを作る", "ご飯に天ぷらを乗せる", "つゆをかける"]', '{"calories": 620, "protein": 18, "fat": 22, "carbs": 85}', '["和食", "丼物", "揚げ物"]'),
('recipe_l04', '牛丼', 'lunch', 15, 2, 1, '["牛肉と玉ねぎを炒める", "だしと調味料で煮る", "ご飯にのせる", "紅生姜を添える"]', '{"calories": 650, "protein": 25, "fat": 20, "carbs": 85}', '["和食", "丼物", "牛肉"]'),
('recipe_l05', '鉄火丼', 'lunch', 10, 1, 1, '["マグロの刺身を切る", "酢飯を作る", "ご飯にマグロを乗せる", "わさび醤油で食べる"]', '{"calories": 420, "protein": 35, "fat": 4, "carbs": 65}', '["和食", "海鮮", "丼物"]'),

-- 麺類
('recipe_l06', 'うどん', 'lunch', 15, 2, 1, '["だしを沸かす", "うどんを茹でる", "具材を準備", "温かいつゆに入れる"]', '{"calories": 320, "protein": 12, "fat": 2, "carbs": 65}', '["和食", "麺類", "温かい"]'),
('recipe_l07', 'そば', 'lunch', 8, 2, 1, '["そばを茹でる", "冷水で締める", "つゆを作る", "薬味を添える"]', '{"calories": 280, "protein": 14, "fat": 2, "carbs": 55}', '["和食", "麺類"]'),
('recipe_l08', 'ラーメン', 'lunch', 25, 3, 1, '["スープを作る", "麺を茹でる", "具材を準備", "盛り付ける"]', '{"calories": 500, "protein": 20, "fat": 15, "carbs": 65}', '["中華", "麺類"]'),
('recipe_l09', '焼きそば', 'lunch', 15, 2, 2, '["野菜と肉を炒める", "蒸し麺を加える", "ソースで味付け", "青のりをかける"]', '{"calories": 450, "protein": 15, "fat": 18, "carbs": 58}', '["中華", "麺類", "炒め物"]'),
('recipe_l10', 'パスタ', 'lunch', 20, 2, 2, '["パスタを茹でる", "ソースを作る", "パスタとソースを和える", "チーズをかける"]', '{"calories": 400, "protein": 12, "fat": 10, "carbs": 70}', '["洋食", "麺類"]'),

-- チャーハン・炒め物
('recipe_l11', 'チャーハン', 'lunch', 10, 2, 1, '["卵を炒める", "冷ご飯を加える", "具材を混ぜる", "調味料で味付け"]', '{"calories": 420, "protein": 16, "fat": 15, "carbs": 58}', '["中華", "炒飯", "卵"]'),
('recipe_l12', 'オムライス', 'lunch', 20, 3, 1, '["チキンライスを作る", "薄焼き卵を作る", "ライスを包む", "ケチャップをかける"]', '{"calories": 520, "protein": 18, "fat": 20, "carbs": 65}', '["洋食", "卵料理", "ライス"]'),
('recipe_l13', 'ピラフ', 'lunch', 25, 2, 2, '["具材を炒める", "米を加えて炒める", "スープで炊く", "パセリを散らす"]', '{"calories": 380, "protein": 12, "fat": 8, "carbs": 70}', '["洋食", "米料理"]'),

-- サンドイッチ・パン類
('recipe_l14', 'サンドイッチ', 'lunch', 10, 1, 2, '["具材を準備", "パンに挟む", "端を切る", "食べやすくカット"]', '{"calories": 350, "protein": 15, "fat": 12, "carbs": 45}', '["洋食", "パン"]'),
('recipe_l15', 'ハンバーガー', 'lunch', 20, 2, 2, '["パティを焼く", "野菜を準備", "パンに挟む", "ソースをかける"]', '{"calories": 480, "protein": 22, "fat": 20, "carbs": 50}', '["洋食", "パン"]'),
('recipe_l16', 'ホットドッグ', 'lunch', 8, 1, 2, '["ソーセージを焼く", "パンに挟む", "ケチャップとマスタード", "玉ねぎを添える"]', '{"calories": 320, "protein": 12, "fat": 18, "carbs": 28}', '["洋食", "パン"]'),

-- 定食・お弁当
('recipe_l17', '焼き魚定食', 'lunch', 20, 2, 1, '["魚を焼く", "ご飯と味噌汁", "小鉢を準備", "バランスよく盛る"]', '{"calories": 520, "protein": 35, "fat": 12, "carbs": 65}', '["和食", "定食", "魚料理"]'),
('recipe_l18', 'とんかつ定食', 'lunch', 30, 3, 1, '["とんかつを揚げる", "キャベツを千切り", "ご飯と味噌汁", "ソースをかける"]', '{"calories": 780, "protein": 28, "fat": 35, "carbs": 85}', '["和食", "定食", "揚げ物"]'),
('recipe_l19', 'お弁当', 'lunch', 25, 2, 1, '["ご飯を詰める", "おかずを作る", "彩りよく詰める", "仕切りを使う"]', '{"calories": 450, "protein": 18, "fat": 12, "carbs": 68}', '["和食", "弁当"]'),

-- サラダ・軽食
('recipe_l20', 'サラダ', 'lunch', 8, 1, 2, '["野菜を洗い切る", "盛り付ける", "ドレッシングをかける", "トッピングを乗せる"]', '{"calories": 80, "protein": 3, "fat": 5, "carbs": 8}', '["洋食", "野菜", "ヘルシー"]'),
('recipe_l21', 'スープ', 'lunch', 20, 2, 3, '["野菜を切る", "鍋で炒める", "水を加えて煮込む", "調味して完成"]', '{"calories": 120, "protein": 5, "fat": 3, "carbs": 18}', '["洋食", "スープ", "野菜"]'),
('recipe_l22', 'おにぎり', 'lunch', 10, 1, 3, '["ご飯に具を入れる", "三角に握る", "海苔を巻く", "塩をまぶす"]', '{"calories": 200, "protein": 4, "fat": 1, "carbs": 45}', '["和食", "携帯食"]'),

-- その他の昼食
('recipe_l23', 'カレーライス', 'lunch', 45, 2, 4, '["野菜と肉を炒める", "水を加えて煮込む", "カレールーを溶く", "ご飯にかける"]', '{"calories": 650, "protein": 20, "fat": 18, "carbs": 95}', '["洋食", "カレー", "煮込み"]'),
('recipe_l24', 'ハヤシライス', 'lunch', 35, 2, 3, '["牛肉と玉ねぎを炒める", "デミグラスソースで煮込む", "ご飯にかける", "パセリを散らす"]', '{"calories": 580, "protein": 22, "fat": 15, "carbs": 85}', '["洋食", "煮込み"]'),
('recipe_l25', 'ドリア', 'lunch', 30, 3, 2, '["ライスを作る", "ホワイトソースをかける", "チーズを乗せる", "オーブンで焼く"]', '{"calories": 520, "protein": 18, "fat": 22, "carbs": 65}', '["洋食", "チーズ", "オーブン"]'),
('recipe_l26', 'リゾット', 'lunch', 25, 3, 2, '["米を炒める", "スープを少しずつ加える", "チーズを混ぜる", "クリーミーに仕上げる"]', '{"calories": 420, "protein": 12, "fat": 15, "carbs": 60}', '["洋食", "米料理"]'),
('recipe_l27', '親子うどん', 'lunch', 18, 2, 1, '["鶏肉と玉ねぎを煮る", "うどんを茹でる", "卵でとじる", "ねぎを散らす"]', '{"calories": 380, "protein": 20, "fat": 8, "carbs": 58}', '["和食", "麺類", "卵"]'),
('recipe_l28', '冷やし中華', 'lunch', 15, 2, 1, '["麺を茹でて冷やす", "具材を準備", "冷たいたれをかける", "彩りよく盛る"]', '{"calories": 420, "protein": 15, "fat": 8, "carbs": 75}', '["中華", "麺類", "冷たい"]'),
('recipe_l29', 'タコライス', 'lunch', 15, 2, 2, '["タコミートを作る", "ご飯の上に乗せる", "野菜とチーズをトッピング", "サルサソースをかける"]', '{"calories": 480, "protein": 18, "fat": 20, "carbs": 58}', '["洋食", "米料理", "メキシコ風"]'),
('recipe_l30', 'ロコモコ', 'lunch', 25, 3, 2, '["ハンバーグを作る", "目玉焼きを焼く", "ご飯の上に乗せる", "グレービーソースをかける"]', '{"calories": 620, "protein": 28, "fat": 25, "carbs": 68}', '["洋食", "ハワイ料理", "米料理"]'),

-- 夕食レシピ（40個）
-- 煮物・煮込み料理
('recipe_d01', '肉じゃが', 'dinner', 35, 3, 4, '["牛肉と野菜を炒める", "だしと調味料を加える", "弱火で煮込む", "味を染み込ませる"]', '{"calories": 280, "protein": 18, "fat": 8, "carbs": 32}', '["和食", "煮物", "牛肉"]'),
('recipe_d02', '筑前煮', 'dinner', 40, 3, 4, '["鶏肉と根菜を切る", "だしで煮込む", "調味料で味付け", "煮汁を煮詰める"]', '{"calories": 220, "protein": 15, "fat": 8, "carbs": 25}', '["和食", "煮物", "鶏肉"]'),
('recipe_d03', 'カレーライス', 'dinner', 45, 2, 4, '["野菜と肉を炒める", "水を加えて煮込む", "カレールーを溶く", "ご飯にかける"]', '{"calories": 750, "protein": 22, "fat": 18, "carbs": 115}', '["洋食", "カレー", "煮込み"]'),
('recipe_d04', 'シチュー', 'dinner', 50, 3, 4, '["肉と野菜を炒める", "水で煮込む", "ルーを加える", "クリーミーに仕上げる"]', '{"calories": 420, "protein": 18, "fat": 20, "carbs": 38}', '["洋食", "煮込み", "クリーム"]'),
('recipe_d05', 'おでん', 'dinner', 60, 3, 4, '["だしを作る", "具材を順番に入れる", "じっくり煮込む", "からしを添える"]', '{"calories": 180, "protein": 12, "fat": 5, "carbs": 20}', '["和食", "煮物", "冬料理"]'),

-- 焼き物
('recipe_d06', '生姜焼き', 'dinner', 20, 2, 2, '["豚肉に下味をつける", "フライパンで焼く", "生姜だれで絡める", "キャベツを添える"]', '{"calories": 350, "protein": 25, "fat": 18, "carbs": 15}', '["和食", "豚肉", "炒め物"]'),
('recipe_d07', '鶏の照り焼き', 'dinner', 20, 2, 3, '["鶏肉を焼く", "照り焼きソースを作る", "絡めながら焼く", "艶よく仕上げる"]', '{"calories": 320, "protein": 28, "fat": 12, "carbs": 18}', '["和食", "鶏肉", "焼き物"]'),
('recipe_d08', '焼き魚', 'dinner', 15, 2, 2, '["魚に塩をふる", "グリルで焼く", "大根おろしを添える", "醤油をかける"]', '{"calories": 180, "protein": 20, "fat": 8, "carbs": 5}', '["和食", "魚料理", "焼き物"]'),
('recipe_d09', 'ハンバーグ', 'dinner', 30, 3, 4, '["ひき肉を捏ねる", "成形して焼く", "ソースを作る", "付け合わせを添える"]', '{"calories": 420, "protein": 25, "fat": 25, "carbs": 20}', '["洋食", "肉料理", "ひき肉"]'),
('recipe_d10', 'ステーキ', 'dinner', 15, 2, 2, '["肉を常温に戻す", "強火で焼く", "休ませる", "ソースを添える"]', '{"calories": 600, "protein": 45, "fat": 35, "carbs": 15}', '["洋食", "牛肉", "焼き物"]'),

-- 揚げ物
('recipe_d11', 'から揚げ', 'dinner', 30, 3, 4, '["鶏肉に下味をつける", "片栗粉をまぶす", "油で揚げる", "レモンを添える"]', '{"calories": 320, "protein": 22, "fat": 20, "carbs": 12}', '["和食", "鶏肉", "揚げ物"]'),
('recipe_d12', '天ぷら', 'dinner', 35, 4, 3, '["衣を作る", "具材に衣をつける", "高温で揚げる", "天つゆで食べる"]', '{"calories": 380, "protein": 12, "fat": 25, "carbs": 28}', '["和食", "揚げ物", "野菜"]'),
('recipe_d13', 'とんかつ', 'dinner', 25, 3, 2, '["豚肉を叩く", "パン粉をつける", "油で揚げる", "ソースをかける"]', '{"calories": 520, "protein": 28, "fat": 30, "carbs": 35}', '["和食", "豚肉", "揚げ物"]'),
('recipe_d14', 'エビフライ', 'dinner', 20, 3, 4, '["エビの下処理", "パン粉をつける", "油で揚げる", "タルタルソースを添える"]', '{"calories": 280, "protein": 18, "fat": 15, "carbs": 20}', '["洋食", "海老", "揚げ物"]'),

-- 炒め物
('recipe_d15', '野菜炒め', 'dinner', 15, 1, 3, '["野菜を切る", "強火で炒める", "調味料で味付け", "手早く仕上げる"]', '{"calories": 120, "protein": 4, "fat": 6, "carbs": 15}', '["中華", "野菜", "炒め物"]'),
('recipe_d16', '回鍋肉', 'dinner', 20, 2, 3, '["豚肉を茹でる", "キャベツと炒める", "味噌だれで味付け", "強火で炒める"]', '{"calories": 280, "protein": 18, "fat": 15, "carbs": 18}', '["中華", "豚肉", "炒め物"]'),
('recipe_d17', '青椒肉絲', 'dinner', 18, 2, 3, '["牛肉を細切り", "ピーマンと炒める", "オイスターソースで味付け", "水溶き片栗粉でとろみ"]', '{"calories": 250, "protein": 20, "fat": 12, "carbs": 15}', '["中華", "牛肉", "炒め物"]'),

-- 蒸し物・茹で物
('recipe_d18', '茶碗蒸し', 'dinner', 25, 3, 4, '["卵液を作る", "具材を器に入れる", "卵液を注ぐ", "蒸し器で蒸す"]', '{"calories": 120, "protein": 8, "fat": 6, "carbs": 8}', '["和食", "蒸し物", "卵料理"]'),
('recipe_d19', 'しゃぶしゃぶ', 'dinner', 30, 2, 4, '["だしを沸かす", "薄切り肉を茹でる", "野菜も茹でる", "ポン酢で食べる"]', '{"calories": 320, "protein": 25, "fat": 15, "carbs": 12}', '["和食", "鍋料理", "茹で物"]'),

-- 鍋料理
('recipe_d20', 'すき焼き', 'dinner', 40, 4, 4, '["牛脂で鍋を熱する", "牛肉を焼く", "野菜と豆腐を加える", "割り下で煮る"]', '{"calories": 450, "protein": 28, "fat": 25, "carbs": 25}', '["和食", "鍋料理", "牛肉"]'),
('recipe_d21', '寄せ鍋', 'dinner', 25, 2, 4, '["だしを作る", "具材を準備", "順番に入れて煮る", "ポン酢で食べる"]', '{"calories": 220, "protein": 18, "fat": 8, "carbs": 15}', '["和食", "鍋料理", "野菜"]'),
('recipe_d22', 'キムチ鍋', 'dinner', 20, 2, 3, '["キムチと豚肉を炒める", "スープを加える", "野菜を入れる", "辛味を調整"]', '{"calories": 280, "protein": 20, "fat": 12, "carbs": 20}', '["韓国料理", "鍋料理", "辛い"]'),

-- 魚料理
('recipe_d23', '鯖の味噌煮', 'dinner', 25, 3, 2, '["鯖に熱湯をかける", "調味料で煮込む", "落し蓋をする", "煮汁を煮詰める"]', '{"calories": 262, "protein": 24, "fat": 18, "carbs": 8}', '["和食", "魚料理", "味噌"]'),
('recipe_d24', '鮭のちゃんちゃん焼き', 'dinner', 20, 2, 3, '["鮭と野菜を炒める", "味噌だれで味付け", "ホットプレートで焼く", "バターを加える"]', '{"calories": 280, "protein": 22, "fat": 15, "carbs": 12}', '["和食", "鮭", "焼き物"]'),
('recipe_d25', 'ぶりの照り焼き', 'dinner', 18, 2, 2, '["ぶりに塩をふる", "フライパンで焼く", "照り焼きだれを絡める", "艶よく仕上げる"]', '{"calories": 320, "protein": 25, "fat": 18, "carbs": 12}', '["和食", "魚料理", "照り焼き"]'),

-- 中華料理
('recipe_d26', '麻婆豆腐', 'dinner', 18, 2, 3, '["豆腐を切る", "ひき肉を炒める", "豆板醤で味付け", "豆腐を加えて煮る"]', '{"calories": 250, "protein": 15, "fat": 15, "carbs": 12}', '["中華", "豆腐", "辛い"]'),
('recipe_d27', '餃子', 'dinner', 40, 3, 4, '["餡を作る", "皮で包む", "フライパンで焼く", "蒸し焼きにする"]', '{"calories": 350, "protein": 15, "fat": 20, "carbs": 30}', '["中華", "点心", "豚肉"]'),
('recipe_d28', 'エビチリ', 'dinner', 20, 3, 3, '["エビの下処理", "片栗粉をまぶす", "チリソースで炒める", "甘酸っぱく仕上げる"]', '{"calories": 280, "protein": 20, "fat": 12, "carbs": 18}', '["中華", "海老", "辛い"]'),

-- 洋食
('recipe_d29', 'ビーフストロガノフ', 'dinner', 35, 3, 4, '["牛肉を炒める", "きのこを加える", "サワークリームで煮込む", "ライスを添える"]', '{"calories": 420, "protein": 25, "fat": 22, "carbs": 32}', '["洋食", "牛肉", "煮込み"]'),
('recipe_d30', 'チキンソテー', 'dinner', 20, 2, 2, '["鶏肉に塩こしょう", "フライパンで焼く", "ソースを作る", "野菜を添える"]', '{"calories": 380, "protein": 28, "fat": 20, "carbs": 15}', '["洋食", "鶏肉", "焼き物"]'),
('recipe_d31', 'ロールキャベツ', 'dinner', 45, 3, 4, '["キャベツを茹でる", "肉だねを包む", "トマトソースで煮込む", "チーズを乗せる"]', '{"calories": 320, "protein": 18, "fat": 15, "carbs": 25}', '["洋食", "煮込み", "野菜"]'),

-- その他の夕食
('recipe_d32', '親子煮', 'dinner', 25, 2, 3, '["鶏肉と野菜を煮る", "だしで味付け", "卵でとじる", "三つ葉を散らす"]', '{"calories": 280, "protein": 22, "fat": 12, "carbs": 18}', '["和食", "鶏肉", "煮物"]'),
('recipe_d33', '肉豆腐', 'dinner', 30, 2, 3, '["牛肉と豆腐を煮る", "ネギを加える", "甘辛く味付け", "汁気を飛ばす"]', '{"calories": 320, "protein": 20, "fat": 18, "carbs": 15}', '["和食", "牛肉", "豆腐"]'),
('recipe_d34', 'きんぴらごぼう', 'dinner', 15, 2, 4, '["ごぼうとにんじんを切る", "炒める", "甘辛く味付け", "ごまを振る"]', '{"calories": 120, "protein": 3, "fat": 5, "carbs": 18}', '["和食", "野菜", "炒め物"]'),
('recipe_d35', 'ひじきの煮物', 'dinner', 20, 2, 4, '["ひじきを戻す", "油揚げと煮る", "だしで煮込む", "甘辛く味付け"]', '{"calories": 90, "protein": 4, "fat": 3, "carbs": 12}', '["和食", "海藻", "煮物"]'),
('recipe_d36', '筍ご飯', 'dinner', 60, 3, 4, '["筍を下茹で", "だしで炊く", "調味料を加える", "木の芽を散らす"]', '{"calories": 320, "protein": 6, "fat": 2, "carbs": 68}', '["和食", "筍", "炊き込みご飯"]'),
('recipe_d37', '鶏つくね', 'dinner', 25, 3, 4, '["鶏ひき肉で団子を作る", "フライパンで焼く", "たれを絡める", "大葉を添える"]', '{"calories": 280, "protein": 20, "fat": 15, "carbs": 12}', '["和食", "鶏肉", "つくね"]'),
('recipe_d38', '豚角煮', 'dinner', 90, 4, 4, '["豚バラを下茹で", "調味料で煮込む", "じっくり煮る", "とろとろに仕上げる"]', '{"calories": 450, "protein": 22, "fat": 35, "carbs": 8}', '["和食", "豚肉", "煮込み"]'),
('recipe_d39', 'さんまの塩焼き', 'dinner', 15, 2, 2, '["さんまに塩をふる", "グリルで焼く", "大根おろしを添える", "すだちを絞る"]', '{"calories": 310, "protein": 20, "fat": 24, "carbs": 2}', '["和食", "魚料理", "秋料理"]'),
('recipe_d40', '手作り餃子', 'dinner', 50, 4, 6, '["皮から作る", "餡を包む", "焼き餃子にする", "酢醤油で食べる"]', '{"calories": 380, "protein": 16, "fat": 22, "carbs": 32}', '["中華", "点心", "手作り"]')
ON CONFLICT (id) DO NOTHING;

-- 包括的なレシピと食材の関連データ
INSERT INTO recipe_ingredients (id, "recipeId", "ingredientId", quantity, unit) VALUES
-- 朝食レシピの食材関連（詳細版）
('ri_b01_1', 'recipe_b01', 'ing_rice', 150, 'g'),
('ri_b01_2', 'recipe_b01', 'ing_egg', 1, '個'),
('ri_b01_3', 'recipe_b01', 'ing_soy_sauce', 5, 'ml'),
('ri_b02_1', 'recipe_b02', 'ing_egg', 2, '個'),
('ri_b02_2', 'recipe_b02', 'ing_oil', 5, 'ml'),
('ri_b02_3', 'recipe_b02', 'ing_salt', 2, 'g'),
('ri_b03_1', 'recipe_b03', 'ing_egg', 3, '個'),
('ri_b03_2', 'recipe_b03', 'ing_butter', 10, 'g'),
('ri_b03_3', 'recipe_b03', 'ing_milk', 30, 'ml'),
('ri_b04_1', 'recipe_b04', 'ing_egg', 2, '個'),
('ri_b04_2', 'recipe_b04', 'ing_butter', 10, 'g'),
('ri_b04_3', 'recipe_b04', 'ing_cheese', 20, 'g'),
('ri_b05_1', 'recipe_b05', 'ing_egg', 3, '個'),
('ri_b05_2', 'recipe_b05', 'ing_kombu', 2, 'g'),
('ri_b05_3', 'recipe_b05', 'ing_soy_sauce', 10, 'ml'),
('ri_b05_4', 'recipe_b05', 'ing_mirin', 5, 'ml'),
('ri_b06_1', 'recipe_b06', 'ing_bread', 60, 'g'),
('ri_b06_2', 'recipe_b06', 'ing_butter', 10, 'g'),
('ri_b07_1', 'recipe_b07', 'ing_bread', 60, 'g'),
('ri_b07_2', 'recipe_b07', 'ing_egg', 1, '個'),
('ri_b07_3', 'recipe_b07', 'ing_milk', 50, 'ml'),
('ri_b07_4', 'recipe_b07', 'ing_butter', 10, 'g'),
('ri_b09_1', 'recipe_b09', 'ing_salmon', 80, 'g'),
('ri_b09_2', 'recipe_b09', 'ing_rice', 150, 'g'),
('ri_b09_3', 'recipe_b09', 'ing_daikon', 50, 'g'),
('ri_b09_4', 'recipe_b09', 'ing_miso', 20, 'g'),
('ri_b10_1', 'recipe_b10', 'ing_natto', 50, 'g'),
('ri_b10_2', 'recipe_b10', 'ing_rice', 150, 'g'),
('ri_b10_3', 'recipe_b10', 'ing_negi', 10, 'g'),
('ri_b10_4', 'recipe_b10', 'ing_soy_sauce', 5, 'ml'),
('ri_b11_1', 'recipe_b11', 'ing_rice', 150, 'g'),
('ri_b11_2', 'recipe_b11', 'ing_salmon', 30, 'g'),
('ri_b11_3', 'recipe_b11', 'ing_nori', 1, '枚'),
('ri_b11_4', 'recipe_b11', 'ing_salt', 2, 'g'),
('ri_b12_1', 'recipe_b12', 'ing_tofu', 60, 'g'),
('ri_b12_2', 'recipe_b12', 'ing_wakame', 3, 'g'),
('ri_b12_3', 'recipe_b12', 'ing_miso', 20, 'g'),
('ri_b12_4', 'recipe_b12', 'ing_negi', 10, 'g'),
('ri_b12_5', 'recipe_b12', 'ing_kombu', 2, 'g'),

-- 昼食レシピの食材関連（詳細版）
('ri_l01_1', 'recipe_l01', 'ing_chicken_thigh', 100, 'g'),
('ri_l01_2', 'recipe_l01', 'ing_onion', 50, 'g'),
('ri_l01_3', 'recipe_l01', 'ing_egg', 2, '個'),
('ri_l01_4', 'recipe_l01', 'ing_rice', 150, 'g'),
('ri_l01_5', 'recipe_l01', 'ing_soy_sauce', 15, 'ml'),
('ri_l01_6', 'recipe_l01', 'ing_mirin', 10, 'ml'),
('ri_l01_7', 'recipe_l01', 'ing_kombu', 2, 'g'),
('ri_l02_1', 'recipe_l02', 'ing_pork', 120, 'g'),
('ri_l02_2', 'recipe_l02', 'ing_onion', 60, 'g'),
('ri_l02_3', 'recipe_l02', 'ing_egg', 2, '個'),
('ri_l02_4', 'recipe_l02', 'ing_rice', 150, 'g'),
('ri_l02_5', 'recipe_l02', 'ing_breadcrumbs', 30, 'g'),
('ri_l02_6', 'recipe_l02', 'ing_wheat_flour', 20, 'g'),
('ri_l02_7', 'recipe_l02', 'ing_oil', 200, 'ml'),
('ri_l06_1', 'recipe_l06', 'ing_udon', 200, 'g'),
('ri_l06_2', 'recipe_l06', 'ing_negi', 20, 'g'),
('ri_l06_3', 'recipe_l06', 'ing_kamaboko', 30, 'g'),
('ri_l06_4', 'recipe_l06', 'ing_kombu', 3, 'g'),
('ri_l06_5', 'recipe_l06', 'ing_katsuobushi', 5, 'g'),
('ri_l07_1', 'recipe_l07', 'ing_soba', 200, 'g'),
('ri_l07_2', 'recipe_l07', 'ing_negi', 15, 'g'),
('ri_l07_3', 'recipe_l07', 'ing_nori', 1, '枚'),
('ri_l07_4', 'recipe_l07', 'ing_soy_sauce', 15, 'ml'),
('ri_l07_5', 'recipe_l07', 'ing_mirin', 10, 'ml'),
('ri_l07_6', 'recipe_l07', 'ing_kombu', 3, 'g'),
('ri_l09_1', 'recipe_l09', 'ing_ramen', 150, 'g'),
('ri_l09_2', 'recipe_l09', 'ing_cabbage', 80, 'g'),
('ri_l09_3', 'recipe_l09', 'ing_carrot', 40, 'g'),
('ri_l09_4', 'recipe_l09', 'ing_bean_sprouts', 50, 'g'),
('ri_l09_5', 'recipe_l09', 'ing_pork', 80, 'g'),
('ri_l09_6', 'recipe_l09', 'ing_worcestershire', 20, 'ml'),
('ri_l11_1', 'recipe_l11', 'ing_rice', 150, 'g'),
('ri_l11_2', 'recipe_l11', 'ing_egg', 1, '個'),
('ri_l11_3', 'recipe_l11', 'ing_negi', 15, 'g'),
('ri_l11_4', 'recipe_l11', 'ing_ground_pork', 50, 'g'),
('ri_l11_5', 'recipe_l11', 'ing_soy_sauce', 10, 'ml'),
('ri_l11_6', 'recipe_l11', 'ing_sesame_oil', 5, 'ml'),
('ri_l23_1', 'recipe_l23', 'ing_beef', 150, 'g'),
('ri_l23_2', 'recipe_l23', 'ing_onion', 100, 'g'),
('ri_l23_3', 'recipe_l23', 'ing_carrot', 80, 'g'),
('ri_l23_4', 'recipe_l23', 'ing_potato', 120, 'g'),
('ri_l23_5', 'recipe_l23', 'ing_rice', 200, 'g'),
('ri_l23_6', 'recipe_l23', 'ing_curry_powder', 20, 'g'),

-- 夕食レシピの食材関連（詳細版）
('ri_d01_1', 'recipe_d01', 'ing_beef', 150, 'g'),
('ri_d01_2', 'recipe_d01', 'ing_potato', 200, 'g'),
('ri_d01_3', 'recipe_d01', 'ing_onion', 100, 'g'),
('ri_d01_4', 'recipe_d01', 'ing_carrot', 80, 'g'),
('ri_d01_5', 'recipe_d01', 'ing_soy_sauce', 20, 'ml'),
('ri_d01_6', 'recipe_d01', 'ing_mirin', 15, 'ml'),
('ri_d01_7', 'recipe_d01', 'ing_sugar', 10, 'g'),
('ri_d01_8', 'recipe_d01', 'ing_kombu', 3, 'g'),
('ri_d02_1', 'recipe_d02', 'ing_chicken_thigh', 200, 'g'),
('ri_d02_2', 'recipe_d02', 'ing_carrot', 80, 'g'),
('ri_d02_3', 'recipe_d02', 'ing_lotus_root', 100, 'g'),
('ri_d02_4', 'recipe_d02', 'ing_shiitake', 50, 'g'),
('ri_d02_5', 'recipe_d02', 'ing_soy_sauce', 25, 'ml'),
('ri_d02_6', 'recipe_d02', 'ing_mirin', 20, 'ml'),
('ri_d02_7', 'recipe_d02', 'ing_kombu', 5, 'g'),
('ri_d06_1', 'recipe_d06', 'ing_pork_shoulder', 200, 'g'),
('ri_d06_2', 'recipe_d06', 'ing_cabbage', 100, 'g'),
('ri_d06_3', 'recipe_d06', 'ing_ginger', 15, 'g'),
('ri_d06_4', 'recipe_d06', 'ing_soy_sauce', 20, 'ml'),
('ri_d06_5', 'recipe_d06', 'ing_mirin', 15, 'ml'),
('ri_d06_6', 'recipe_d06', 'ing_sake', 10, 'ml'),
('ri_d07_1', 'recipe_d07', 'ing_chicken_thigh', 250, 'g'),
('ri_d07_2', 'recipe_d07', 'ing_soy_sauce', 25, 'ml'),
('ri_d07_3', 'recipe_d07', 'ing_mirin', 20, 'ml'),
('ri_d07_4', 'recipe_d07', 'ing_sugar', 15, 'g'),
('ri_d07_5', 'recipe_d07', 'ing_sake', 10, 'ml'),
('ri_d09_1', 'recipe_d09', 'ing_ground_beef', 200, 'g'),
('ri_d09_2', 'recipe_d09', 'ing_onion', 80, 'g'),
('ri_d09_3', 'recipe_d09', 'ing_egg', 1, '個'),
('ri_d09_4', 'recipe_d09', 'ing_breadcrumbs', 30, 'g'),
('ri_d09_5', 'recipe_d09', 'ing_milk', 30, 'ml'),
('ri_d09_6', 'recipe_d09', 'ing_ketchup', 30, 'ml'),
('ri_d09_7', 'recipe_d09', 'ing_worcestershire', 10, 'ml'),
('ri_d11_1', 'recipe_d11', 'ing_chicken_thigh', 300, 'g'),
('ri_d11_2', 'recipe_d11', 'ing_ginger', 10, 'g'),
('ri_d11_3', 'recipe_d11', 'ing_garlic', 5, 'g'),
('ri_d11_4', 'recipe_d11', 'ing_soy_sauce', 20, 'ml'),
('ri_d11_5', 'recipe_d11', 'ing_sake', 15, 'ml'),
('ri_d11_6', 'recipe_d11', 'ing_wheat_flour', 50, 'g'),
('ri_d11_7', 'recipe_d11', 'ing_oil', 300, 'ml'),
('ri_d11_8', 'recipe_d11', 'ing_lemon', 30, 'g'),
('ri_d12_1', 'recipe_d12', 'ing_shrimp', 200, 'g'),
('ri_d12_2', 'recipe_d12', 'ing_eggplant', 100, 'g'),
('ri_d12_3', 'recipe_d12', 'ing_green_pepper', 50, 'g'),
('ri_d12_4', 'recipe_d12', 'ing_shiitake', 50, 'g'),
('ri_d12_5', 'recipe_d12', 'ing_wheat_flour', 100, 'g'),
('ri_d12_6', 'recipe_d12', 'ing_egg', 1, '個'),
('ri_d12_7', 'recipe_d12', 'ing_oil', 400, 'ml'),
('ri_d12_8', 'recipe_d12', 'ing_daikon', 100, 'g'),
('ri_d12_9', 'recipe_d12', 'ing_soy_sauce', 20, 'ml'),
('ri_d20_1', 'recipe_d20', 'ing_beef_sirloin', 300, 'g'),
('ri_d20_2', 'recipe_d20', 'ing_tofu', 200, 'g'),
('ri_d20_3', 'recipe_d20', 'ing_chinese_cabbage', 150, 'g'),
('ri_d20_4', 'recipe_d20', 'ing_negi', 50, 'g'),
('ri_d20_5', 'recipe_d20', 'ing_shiitake', 80, 'g'),
('ri_d20_6', 'recipe_d20', 'ing_soy_sauce', 30, 'ml'),
('ri_d20_7', 'recipe_d20', 'ing_mirin', 25, 'ml'),
('ri_d20_8', 'recipe_d20', 'ing_sugar', 20, 'g'),
('ri_d23_1', 'recipe_d23', 'ing_mackerel', 200, 'g'),
('ri_d23_2', 'recipe_d23', 'ing_miso', 30, 'g'),
('ri_d23_3', 'recipe_d23', 'ing_ginger', 10, 'g'),
('ri_d23_4', 'recipe_d23', 'ing_sake', 20, 'ml'),
('ri_d23_5', 'recipe_d23', 'ing_sugar', 15, 'g'),
('ri_d26_1', 'recipe_d26', 'ing_tofu', 200, 'g'),
('ri_d26_2', 'recipe_d26', 'ing_ground_pork', 100, 'g'),
('ri_d26_3', 'recipe_d26', 'ing_negi', 20, 'g'),
('ri_d26_4', 'recipe_d26', 'ing_ginger', 5, 'g'),
('ri_d26_5', 'recipe_d26', 'ing_garlic', 5, 'g'),
('ri_d26_6', 'recipe_d26', 'ing_miso', 15, 'g'),
('ri_d26_7', 'recipe_d26', 'ing_soy_sauce', 10, 'ml'),
('ri_d27_1', 'recipe_d27', 'ing_ground_pork', 200, 'g'),
('ri_d27_2', 'recipe_d27', 'ing_cabbage', 150, 'g'),
('ri_d27_3', 'recipe_d27', 'ing_negi', 30, 'g'),
('ri_d27_4', 'recipe_d27', 'ing_ginger', 10, 'g'),
('ri_d27_5', 'recipe_d27', 'ing_garlic', 5, 'g'),
('ri_d27_6', 'recipe_d27', 'ing_soy_sauce', 15, 'ml'),
('ri_d27_7', 'recipe_d27', 'ing_sesame_oil', 10, 'ml'),
('ri_d33_1', 'recipe_d33', 'ing_beef', 150, 'g'),
('ri_d33_2', 'recipe_d33', 'ing_tofu', 200, 'g'),
('ri_d33_3', 'recipe_d33', 'ing_negi', 50, 'g'),
('ri_d33_4', 'recipe_d33', 'ing_soy_sauce', 20, 'ml'),
('ri_d33_5', 'recipe_d33', 'ing_mirin', 15, 'ml'),
('ri_d33_6', 'recipe_d33', 'ing_sugar', 10, 'g'),
('ri_d39_1', 'recipe_d39', 'ing_saury', 200, 'g'),
('ri_d39_2', 'recipe_d39', 'ing_salt', 5, 'g'),
('ri_d39_3', 'recipe_d39', 'ing_daikon', 80, 'g'),
('ri_d39_4', 'recipe_d39', 'ing_yuzu', 10, 'g'),

-- 追加の食材（かまぼこなど）
('ri_missing_1', 'recipe_l06', 'ing_tofu', 50, 'g'), -- かまぼこの代替として豆腐を使用

-- 季節の特産品を使ったレシピの関連
('ri_spring_1', 'recipe_d36', 'ing_bamboo_shoots', 150, 'g'),
('ri_spring_2', 'recipe_d36', 'ing_rice', 200, 'g'),
('ri_spring_3', 'recipe_d36', 'ing_kombu', 5, 'g'),
('ri_spring_4', 'recipe_d36', 'ing_soy_sauce', 25, 'ml'),
('ri_autumn_1', 'recipe_d34', 'ing_lotus_root', 150, 'g'),
('ri_autumn_2', 'recipe_d34', 'ing_carrot', 50, 'g'),
('ri_autumn_3', 'recipe_d34', 'ing_sesame_oil', 10, 'ml'),
('ri_autumn_4', 'recipe_d34', 'ing_sesame_seeds', 5, 'g'),
('ri_autumn_5', 'recipe_d34', 'ing_soy_sauce', 15, 'ml'),
('ri_winter_1', 'recipe_d35', 'ing_hijiki', 20, 'g'),
('ri_winter_2', 'recipe_d35', 'ing_aburaage', 30, 'g'),
('ri_winter_3', 'recipe_d35', 'ing_carrot', 40, 'g'),
('ri_winter_4', 'recipe_d35', 'ing_soy_sauce', 20, 'ml'),
('ri_winter_5', 'recipe_d35', 'ing_mirin', 15, 'ml')
ON CONFLICT (id) DO NOTHING;

-- 季節の料理レシピを追加（50個の追加レシピ）
INSERT INTO recipes (id, name, category, "cookingTime", difficulty, servings, instructions, nutrition, tags) VALUES
-- 春の料理（15個）
('recipe_spring_01', 'たけのこご飯', 'dinner', 60, 3, 4, '["たけのこを下茹でする", "米と一緒に炊く", "だしと調味料を加える", "木の芽を散らす"]', '{"calories": 320, "protein": 6, "fat": 2, "carbs": 68}', '["和食", "春料理", "炊き込みご飯"]'),
('recipe_spring_02', 'そら豆の塩茹で', 'lunch', 15, 1, 4, '["そら豆をさやから出す", "塩茹でする", "冷水で冷ます", "塩をふって完成"]', '{"calories": 108, "protein": 10.9, "fat": 0.2, "carbs": 15.5}', '["和食", "春料理", "野菜"]'),
('recipe_spring_03', 'アスパラの肉巻き', 'dinner', 20, 2, 3, '["アスパラを茹でる", "豚肉で巻く", "フライパンで焼く", "照り焼きたれで絡める"]', '{"calories": 280, "protein": 20, "fat": 18, "carbs": 8}', '["和食", "春料理", "豚肉"]'),
('recipe_spring_04', '菜の花のお浸し', 'dinner', 10, 1, 4, '["菜の花を茹でる", "冷水で冷ます", "だし醤油をかける", "かつお節を散らす"]', '{"calories": 25, "protein": 2.9, "fat": 0.2, "carbs": 4.3}', '["和食", "春料理", "野菜"]'),
('recipe_spring_05', '鯛の刺身', 'dinner', 15, 3, 2, '["鯛を三枚におろす", "薄く切る", "大根のつまを作る", "わさび醤油で食べる"]', '{"calories": 142, "protein": 20.6, "fat": 5.8, "carbs": 0.1}', '["和食", "春料理", "刺身"]'),
('recipe_spring_06', 'かつおのたたき', 'dinner', 25, 3, 3, '["かつおの表面を焼く", "氷水で冷ます", "薄くスライス", "ポン酢で食べる"]', '{"calories": 165, "protein": 25.8, "fat": 6.2, "carbs": 0.1}', '["和食", "春料理", "魚料理"]'),
('recipe_spring_07', '桜餅', 'breakfast', 45, 4, 6, '["道明寺粉を蒸す", "あんこを包む", "桜の葉で巻く", "蒸し上げる"]', '{"calories": 180, "protein": 3.2, "fat": 0.5, "carbs": 40.8}', '["和食", "春料理", "和菓子"]'),
('recipe_spring_08', '新玉ねぎのサラダ', 'lunch', 10, 1, 3, '["新玉ねぎを薄切り", "水にさらす", "ドレッシングをかける", "かつお節を散らす"]', '{"calories": 45, "protein": 1.2, "fat": 0.1, "carbs": 10.8}', '["和食", "春料理", "サラダ"]'),
('recipe_spring_09', 'たけのこの土佐煮', 'dinner', 40, 3, 4, '["たけのこを下茹で", "だしで煮る", "かつお節を加える", "醤油で味付け"]', '{"calories": 35, "protein": 3.8, "fat": 0.3, "carbs": 5.1}', '["和食", "春料理", "煮物"]'),
('recipe_spring_10', '春キャベツの浅漬け', 'lunch', 30, 1, 4, '["キャベツを切る", "塩でもむ", "昆布を加える", "重しをして漬ける"]', '{"calories": 18, "protein": 1.0, "fat": 0.1, "carbs": 4.2}', '["和食", "春料理", "漬物"]'),
('recipe_spring_11', 'わらびの炊き合わせ', 'dinner', 35, 3, 4, '["わらびのあく抜き", "油揚げと煮る", "だしで炊く", "薄口醤油で味付け"]', '{"calories": 85, "protein": 4.2, "fat": 3.8, "carbs": 8.5}', '["和食", "春料理", "山菜"]'),
('recipe_spring_12', '桜エビのかき揚げ', 'dinner', 25, 3, 3, '["桜エビと野菜を混ぶ", "天ぷら衣をつける", "油で揚げる", "天つゆで食べる"]', '{"calories": 220, "protein": 12, "fat": 15, "carbs": 18}', '["和食", "春料理", "揚げ物"]'),
('recipe_spring_13', 'いちご大福', 'breakfast', 60, 4, 8, '["求肥を作る", "あんこでいちごを包む", "求肥で包む", "形を整える"]', '{"calories": 150, "protein": 2.5, "fat": 0.3, "carbs": 35.2}', '["和食", "春料理", "和菓子"]'),
('recipe_spring_14', '山菜の天ぷら', 'dinner', 30, 3, 4, '["山菜の下処理", "天ぷら衣をつける", "油で揚げる", "塩で食べる"]', '{"calories": 180, "protein": 8, "fat": 12, "carbs": 15}', '["和食", "春料理", "揚げ物"]'),
('recipe_spring_15', '新じゃがの煮っころがし', 'dinner', 25, 2, 4, '["新じゃがを茹でる", "だしで煮る", "醤油みりんで味付け", "煮汁を煮詰める"]', '{"calories": 120, "protein": 2.5, "fat": 0.2, "carbs": 28.5}', '["和食", "春料理", "煮物"]'),

-- 夏の料理（15個）
('recipe_summer_01', '冷やし中華', 'lunch', 20, 2, 2, '["中華麺を茹でて冷やす", "具材を準備", "冷たいたれをかける", "彩りよく盛る"]', '{"calories": 420, "protein": 15, "fat": 8, "carbs": 75}', '["中華", "夏料理", "冷たい"]'),
('recipe_summer_02', '冷奴', 'lunch', 5, 1, 2, '["豆腐を冷やす", "薬味を準備", "醤油をかける", "生姜を添える"]', '{"calories": 76, "protein": 8.2, "fat": 4.8, "carbs": 1.9}', '["和食", "夏料理", "冷たい"]'),
('recipe_summer_03', 'そうめん', 'lunch', 15, 1, 2, '["そうめんを茹でる", "冷水で洗う", "つゆを作る", "薬味を添える"]', '{"calories": 280, "protein": 9.5, "fat": 1.2, "carbs": 55.8}', '["和食", "夏料理", "麺類"]'),
('recipe_summer_04', '枝豆', 'lunch', 15, 1, 4, '["枝豆を塩茹で", "冷水で冷やす", "塩をふる", "ビールのお供に"]', '{"calories": 135, "protein": 11.7, "fat": 6.2, "carbs": 8.8}', '["和食", "夏料理", "野菜"]'),
('recipe_summer_05', 'きゅうりの酢の物', 'lunch', 20, 1, 4, '["きゅうりを薄切り", "塩でもむ", "酢で和える", "わかめを加える"]', '{"calories": 20, "protein": 1.2, "fat": 0.1, "carbs": 4.5}', '["和食", "夏料理", "酢の物"]'),
('recipe_summer_06', 'ゴーヤチャンプルー', 'dinner', 20, 2, 3, '["ゴーヤを切る", "豆腐と炒める", "豚肉を加える", "卵でとじる"]', '{"calories": 280, "protein": 18, "fat": 15, "carbs": 18}', '["沖縄料理", "夏料理", "炒め物"]'),
('recipe_summer_07', 'とうもろこしの塩茹で', 'lunch', 15, 1, 4, '["とうもろこしを茹でる", "塩をまぶす", "バターを塗る", "熱いうちに食べる"]', '{"calories": 92, "protein": 3.6, "fat": 1.7, "carbs": 16.8}', '["洋食", "夏料理", "野菜"]'),
('recipe_summer_08', 'アジの南蛮漬け', 'dinner', 40, 3, 4, '["アジを揚げる", "南蛮酢を作る", "野菜と漬ける", "一晩冷やす"]', '{"calories": 180, "protein": 22, "fat": 8, "carbs": 12}', '["和食", "夏料理", "魚料理"]'),
('recipe_summer_09', 'トマトとモッツァレラのサラダ', 'lunch', 10, 1, 3, '["トマトを切る", "モッツァレラを切る", "バジルを散らす", "オリーブオイルをかける"]', '{"calories": 180, "protein": 12, "fat": 15, "carbs": 8}', '["洋食", "夏料理", "サラダ"]'),
('recipe_summer_10', 'かき氷', 'breakfast', 5, 1, 2, '["氷を削る", "シロップをかける", "練乳を添える", "フルーツをトッピング"]', '{"calories": 120, "protein": 0.5, "fat": 0.2, "carbs": 30.5}', '["和食", "夏料理", "デザート"]'),
('recipe_summer_11', 'ナスの味噌炒め', 'dinner', 15, 2, 3, '["ナスを切る", "油で炒める", "味噌だれで味付け", "ねぎを散らす"]', '{"calories": 120, "protein": 3.8, "fat": 8.2, "carbs": 12.5}', '["和食", "夏料理", "炒め物"]'),
('recipe_summer_12', 'オクラのネバネバ和え', 'lunch', 15, 2, 4, '["オクラを茹でる", "細かく切る", "納豆と和える", "醤油で味付け"]', '{"calories": 85, "protein": 8.5, "fat": 4.2, "carbs": 8.8}', '["和食", "夏料理", "ネバネバ"]'),
('recipe_summer_13', 'ピーマンの肉詰め', 'dinner', 30, 3, 4, '["ピーマンをくり抜く", "肉だねを詰める", "フライパンで焼く", "ソースをかける"]', '{"calories": 220, "protein": 15, "fat": 12, "carbs": 18}', '["洋食", "夏料理", "肉料理"]'),
('recipe_summer_14', '冷やし茶碗蒸し', 'lunch', 35, 3, 4, '["卵液を作る", "具材を入れる", "蒸す", "冷蔵庫で冷やす"]', '{"calories": 95, "protein": 7.2, "fat": 5.8, "carbs": 6.5}', '["和食", "夏料理", "冷たい"]'),
('recipe_summer_15', 'スイカ', 'breakfast', 5, 1, 4, '["スイカを切る", "種を取る", "冷やして食べる", "塩を少しふる"]', '{"calories": 37, "protein": 0.6, "fat": 0.2, "carbs": 9.5}', '["和食", "夏料理", "フルーツ"]'),

-- 秋の料理（10個）
('recipe_autumn_01', 'さんまの塩焼き', 'dinner', 15, 2, 2, '["さんまに塩をふる", "グリルで焼く", "大根おろしを添える", "すだちを絞る"]', '{"calories": 310, "protein": 20, "fat": 24, "carbs": 2}', '["和食", "秋料理", "魚料理"]'),
('recipe_autumn_02', 'きのこの炊き込みご飯', 'dinner', 50, 3, 4, '["きのこを炒める", "米と一緒に炊く", "だしで味付け", "三つ葉を散らす"]', '{"calories": 280, "protein": 8, "fat": 3, "carbs": 58}', '["和食", "秋料理", "炊き込みご飯"]'),
('recipe_autumn_03', '栗ご飯', 'dinner', 60, 3, 4, '["栗の皮をむく", "米と一緒に炊く", "塩で味付け", "ごまを散らす"]', '{"calories": 320, "protein": 6, "fat": 2, "carbs": 72}', '["和食", "秋料理", "炊き込みご飯"]'),
('recipe_autumn_04', 'かぼちゃの煮物', 'dinner', 25, 2, 4, '["かぼちゃを切る", "だしで煮る", "醤油みりんで味付け", "煮汁を煮詰める"]', '{"calories": 120, "protein": 2.8, "fat": 0.5, "carbs": 28.2}', '["和食", "秋料理", "煮物"]'),
('recipe_autumn_05', 'さつまいもの天ぷら', 'dinner', 25, 3, 4, '["さつまいもを切る", "天ぷら衣をつける", "油で揚げる", "塩で食べる"]', '{"calories": 220, "protein": 3.5, "fat": 12, "carbs": 28}', '["和食", "秋料理", "揚げ物"]'),
('recipe_autumn_06', '鮭のムニエル', 'dinner', 20, 2, 2, '["鮭に塩こしょう", "小麦粉をまぶす", "バターで焼く", "レモンを添える"]', '{"calories": 280, "protein": 25, "fat": 18, "carbs": 8}', '["洋食", "秋料理", "魚料理"]'),
('recipe_autumn_07', 'きのこのパスタ', 'lunch', 25, 2, 2, '["きのこを炒める", "パスタを茹でる", "和える", "パルメザンチーズをかける"]', '{"calories": 420, "protein": 15, "fat": 12, "carbs": 65}', '["洋食", "秋料理", "パスタ"]'),
('recipe_autumn_08', '柿なます', 'lunch', 20, 2, 4, '["柿を切る", "大根と人参を切る", "酢で和える", "ゆずを加える"]', '{"calories": 45, "protein": 0.8, "fat": 0.1, "carbs": 11.5}', '["和食", "秋料理", "酢の物"]'),
('recipe_autumn_09', 'ぶりの照り焼き', 'dinner', 20, 2, 2, '["ぶりに塩をふる", "フライパンで焼く", "照り焼きたれを絡める", "大根おろしを添える"]', '{"calories": 320, "protein": 25, "fat": 18, "carbs": 12}', '["和食", "秋料理", "魚料理"]'),
('recipe_autumn_10', 'れんこんのきんぴら', 'dinner', 15, 2, 4, '["れんこんを切る", "酢水にさらす", "炒める", "甘辛く味付け"]', '{"calories": 85, "protein": 2.2, "fat": 3.5, "carbs": 12.8}', '["和食", "秋料理", "炒め物"]'),

-- 冬の料理（10個）
('recipe_winter_01', 'おでん', 'dinner', 120, 3, 6, '["だしを作る", "具材を順番に入れる", "じっくり煮込む", "からしを添える"]', '{"calories": 180, "protein": 12, "fat": 5, "carbs": 20}', '["和食", "冬料理", "煮物"]'),
('recipe_winter_02', '鍋焼きうどん', 'lunch', 25, 2, 2, '["だしを沸かす", "うどんを入れる", "具材を加える", "卵を落とす"]', '{"calories": 380, "protein": 18, "fat": 8, "carbs": 65}', '["和食", "冬料理", "麺類"]'),
('recipe_winter_03', 'ぶり大根', 'dinner', 60, 3, 4, '["ぶりを下茹で", "大根と煮込む", "醤油で味付け", "煮汁を煮詰める"]', '{"calories": 220, "protein": 18, "fat": 12, "carbs": 15}', '["和食", "冬料理", "煮物"]'),
('recipe_winter_04', '白菜と豚肉の重ね蒸し', 'dinner', 40, 2, 4, '["白菜と豚肉を重ねる", "蒸し器で蒸す", "ポン酢で食べる", "もみじおろしを添える"]', '{"calories": 220, "protein": 16, "fat": 12, "carbs": 15}', '["和食", "冬料理", "蒸し物"]'),
('recipe_winter_05', 'ほうれん草のお浸し', 'lunch', 10, 1, 4, '["ほうれん草を茹でる", "冷水で冷ます", "だし醤油をかける", "かつお節を散らす"]', '{"calories": 25, "protein": 2.8, "fat": 0.5, "carbs": 3.8}', '["和食", "冬料理", "野菜"]'),
('recipe_winter_06', '牡蠣鍋', 'dinner', 30, 3, 4, '["牡蠣の下処理", "野菜と煮る", "味噌で味付け", "ねぎを散らす"]', '{"calories": 180, "protein": 15, "fat": 8, "carbs": 12}', '["和食", "冬料理", "鍋料理"]'),
('recipe_winter_07', '大根と鶏肉の煮物', 'dinner', 40, 2, 4, '["大根を下茹で", "鶏肉と煮込む", "だしで味付け", "煮汁を煮詰める"]', '{"calories": 180, "protein": 15, "fat": 8, "carbs": 18}', '["和食", "冬料理", "煮物"]'),
('recipe_winter_08', 'カニクリームコロッケ', 'dinner', 50, 4, 6, '["ホワイトソースを作る", "カニを加える", "成形して揚げる", "パン粉をつける"]', '{"calories": 320, "protein": 12, "fat": 18, "carbs": 28}', '["洋食", "冬料理", "揚げ物"]'),
('recipe_winter_09', '七草粥', 'breakfast', 30, 2, 4, '["七草を茹でる", "粥を炊く", "七草を加える", "塩で味付け"]', '{"calories": 150, "protein": 3.8, "fat": 0.5, "carbs": 32.5}', '["和食", "冬料理", "粥"]'),
('recipe_winter_10', 'みかん', 'breakfast', 2, 1, 2, '["みかんの皮をむく", "房に分ける", "冷やして食べる"]', '{"calories": 45, "protein": 0.7, "fat": 0.1, "carbs": 11.9}', '["和食", "冬料理", "フルーツ"]')
ON CONFLICT (id) DO NOTHING;