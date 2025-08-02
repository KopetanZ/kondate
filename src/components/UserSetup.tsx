'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface UserPreferencesForm {
  familySize: number
  hasChildren: boolean
  hasElderly: boolean
  allowsCurryTwoDays: boolean
  eatsBreakfastBread: boolean
  eatsGranolaOrCereal: boolean
  wantsRestDays: boolean
  usesFrozenFoods: boolean
  usesPreparedFoods: boolean
  allergies: string[]
}

interface UserSetupProps {
  onComplete: (preferences: UserPreferencesForm) => void
  currentUser?: { id: string; familyName: string; familyIcon: string }
  onLogout?: () => void
}

export default function UserSetup({ onComplete, currentUser, onLogout }: UserSetupProps) {
  const [step, setStep] = useState(1)
  const [preferences, setPreferences] = useState<UserPreferencesForm>({
    familySize: 2,
    hasChildren: false,
    hasElderly: false,
    allowsCurryTwoDays: true,
    eatsBreakfastBread: true,
    eatsGranolaOrCereal: false,
    wantsRestDays: true,
    usesFrozenFoods: true,
    usesPreparedFoods: true,
    allergies: []
  })

  const [customAllergy, setCustomAllergy] = useState('')

  const commonAllergies = [
    '卵', '乳', '小麦', 'えび', 'かに', 'そば', '落花生', 'アーモンド',
    '鶏肉', '豚肉', '牛肉', '魚介類', 'いか', 'たこ', '大豆', 'ごま'
  ]

  const updatePreference = (key: keyof UserPreferencesForm, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const toggleAllergy = (allergy: string) => {
    setPreferences(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }))
  }

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !preferences.allergies.includes(customAllergy.trim())) {
      setPreferences(prev => ({
        ...prev,
        allergies: [...prev.allergies, customAllergy.trim()]
      }))
      setCustomAllergy('')
    }
  }

  const removeAllergy = (allergy: string) => {
    setPreferences(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }))
  }

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      onComplete(preferences)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">
                初期設定 - {step}/4
              </CardTitle>
              <CardDescription>
                あなたの食事の好みや家族構成を教えてください
              </CardDescription>
            </div>
            {currentUser && (
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{currentUser.familyIcon}</span>
                <span className="text-sm font-medium">{currentUser.familyName}</span>
                {onLogout && (
                  <Button variant="outline" size="sm" onClick={onLogout}>
                    ログアウト
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">家族構成について</h3>
              
              <div className="space-y-2">
                <Label htmlFor="familySize">家族の人数</Label>
                <Select value={preferences.familySize.toString()} onValueChange={(value) => updatePreference('familySize', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="人数を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}人</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasChildren"
                  checked={preferences.hasChildren}
                  onCheckedChange={(checked) => updatePreference('hasChildren', checked)}
                />
                <Label htmlFor="hasChildren">小さな子供がいる</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasElderly"
                  checked={preferences.hasElderly}
                  onCheckedChange={(checked) => updatePreference('hasElderly', checked)}
                />
                <Label htmlFor="hasElderly">高齢者がいる</Label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">食事のスタイルについて</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowsCurryTwoDays"
                  checked={preferences.allowsCurryTwoDays}
                  onCheckedChange={(checked) => updatePreference('allowsCurryTwoDays', checked)}
                />
                <Label htmlFor="allowsCurryTwoDays">カレーなどは2日連続で食べても大丈夫</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eatsBreakfastBread"
                  checked={preferences.eatsBreakfastBread}
                  onCheckedChange={(checked) => updatePreference('eatsBreakfastBread', checked)}
                />
                <Label htmlFor="eatsBreakfastBread">朝食にパンを食べる</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eatsGranolaOrCereal"
                  checked={preferences.eatsGranolaOrCereal}
                  onCheckedChange={(checked) => updatePreference('eatsGranolaOrCereal', checked)}
                />
                <Label htmlFor="eatsGranolaOrCereal">グラノーラやシリアルを食べる習慣がある</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wantsRestDays"
                  checked={preferences.wantsRestDays}
                  onCheckedChange={(checked) => updatePreference('wantsRestDays', checked)}
                />
                <Label htmlFor="wantsRestDays">料理の休憩日を作りたい</Label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">調理について</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="usesFrozenFoods"
                  checked={preferences.usesFrozenFoods}
                  onCheckedChange={(checked) => updatePreference('usesFrozenFoods', checked)}
                />
                <Label htmlFor="usesFrozenFoods">冷凍食品（餃子など）を活用したい</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="usesPreparedFoods"
                  checked={preferences.usesPreparedFoods}
                  onCheckedChange={(checked) => updatePreference('usesPreparedFoods', checked)}
                />
                <Label htmlFor="usesPreparedFoods">お惣菜を活用したい</Label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">アレルギーについて</h3>
              
              <div className="space-y-2">
                <Label>該当するアレルギーがあればチェックしてください</Label>
                <div className="grid grid-cols-2 gap-2">
                  {commonAllergies.map(allergy => (
                    <div key={allergy} className="flex items-center space-x-2">
                      <Checkbox
                        id={allergy}
                        checked={preferences.allergies.includes(allergy)}
                        onCheckedChange={() => toggleAllergy(allergy)}
                      />
                      <Label htmlFor={allergy}>{allergy}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customAllergy">その他のアレルギー</Label>
                <div className="flex space-x-2">
                  <Input
                    id="customAllergy"
                    value={customAllergy}
                    onChange={(e) => setCustomAllergy(e.target.value)}
                    placeholder="アレルギー名を入力"
                  />
                  <Button type="button" onClick={addCustomAllergy}>追加</Button>
                </div>
              </div>

              {preferences.allergies.length > 0 && (
                <div className="space-y-2">
                  <Label>選択されたアレルギー</Label>
                  <div className="flex flex-wrap gap-2">
                    {preferences.allergies.map(allergy => (
                      <div key={allergy} className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm flex items-center space-x-1">
                        <span>{allergy}</span>
                        <button
                          type="button"
                          onClick={() => removeAllergy(allergy)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            戻る
          </Button>
          <div className="flex space-x-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map(num => (
                <div
                  key={num}
                  className={`w-2 h-2 rounded-full ${
                    num === step ? 'bg-blue-500' : num < step ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <Button onClick={nextStep}>
            {step === 4 ? '完了' : '次へ'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}