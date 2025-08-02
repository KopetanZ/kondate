'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface RegisterProps {
  onRegisterSuccess: (user: { id: string; familyName: string; familyIcon: string }) => void
  onSwitchToLogin: () => void
}

const FAMILY_ICONS = ['🏠', '🏡', '🏘️', '🏰', '🎪', '⛺', '🏖️', '🌟', '🌈', '☀️', '🌙', '⭐']

const PASSWORD_ICONS = [
  '🍎', '🍌', '🍊', '🍇', '🍓', '🥕', '🍅', '🥒', '🌽', '🥖',
  '🍖', '🐟', '🍳', '🧀', '🥛', '🍚', '🍜', '🍕', '🍰', '🍪',
  '⚽', '🎾', '🏀', '🎱', '🎸', '🎹', '🎨', '📚', '🚗', '✈️'
]

export default function Register({ onRegisterSuccess, onSwitchToLogin }: RegisterProps) {
  const [familyName, setFamilyName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('')
  const [selectedPassword, setSelectedPassword] = useState<string[]>([])
  const [confirmPassword, setConfirmPassword] = useState<string[]>([])
  const [step, setStep] = useState<'password' | 'confirm'>('password')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleIconClick = (icon: string) => {
    const currentPassword = step === 'password' ? selectedPassword : confirmPassword
    const setCurrentPassword = step === 'password' ? setSelectedPassword : setConfirmPassword
    
    if (currentPassword.includes(icon)) {
      setCurrentPassword(prev => prev.filter(i => i !== icon))
    } else if (currentPassword.length < 4) {
      setCurrentPassword(prev => [...prev, icon])
    }
  }

  const handleNext = () => {
    if (!familyName.trim()) {
      setError('家族名を入力してください')
      return
    }
    if (!selectedIcon) {
      setError('家族のアイコンを選択してください')
      return
    }
    if (selectedPassword.length !== 4) {
      setError('4つの絵を選択してください')
      return
    }
    
    setError('')
    setStep('confirm')
  }

  const handleRegister = async () => {
    if (JSON.stringify(selectedPassword) !== JSON.stringify(confirmPassword)) {
      setError('パスワードが一致しません')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          familyName: familyName.trim(),
          familyIcon: selectedIcon,
          password: selectedPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        onRegisterSuccess(data.user)
      } else {
        setError(data.error || '登録に失敗しました')
      }
    } catch (error) {
      setError('サーバーに接続できませんでした')
    } finally {
      setLoading(false)
    }
  }

  const currentPassword = step === 'password' ? selectedPassword : confirmPassword

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">新規登録</CardTitle>
          <CardDescription className="text-center">
            {step === 'password' 
              ? '家族名、アイコン、パスワードを設定してください'
              : 'パスワードを再入力して確認してください'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 'password' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">家族名</label>
                <Input
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="〇〇家"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">家族のアイコン</label>
                <div className="grid grid-cols-6 gap-2 mb-4">
                  {FAMILY_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setSelectedIcon(icon)}
                      className={`p-2 text-2xl border rounded hover:bg-gray-100 ${
                        selectedIcon === icon
                          ? 'bg-blue-100 border-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              {step === 'password' 
                ? 'パスワード（4つの絵を順番に選択）'
                : 'パスワードを再入力してください'
              }
            </label>
            <div className="grid grid-cols-6 gap-2 mb-4">
              {PASSWORD_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => handleIconClick(icon)}
                  className={`p-2 text-2xl border rounded hover:bg-gray-100 ${
                    currentPassword.includes(icon)
                      ? 'bg-blue-100 border-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600">選択中：</span>
              {currentPassword.map((icon, index) => (
                <span key={index} className="text-xl">{icon}</span>
              ))}
              <span className="text-sm text-gray-400">
                ({currentPassword.length}/4)
              </span>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            {step === 'password' ? (
              <Button onClick={handleNext} className="w-full">
                次へ
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? '登録中...' : '登録する'}
                </Button>
                <Button 
                  onClick={() => setStep('password')}
                  variant="outline"
                  className="w-full"
                >
                  戻る
                </Button>
              </>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:underline text-sm"
            >
              既にアカウントをお持ちの方はログイン
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}