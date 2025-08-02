'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface LoginProps {
  onLoginSuccess: (user: { id: string; familyName: string; familyIcon: string }) => void
  onSwitchToRegister?: () => void
  onBack?: () => void
  selectedUser?: { id: string; familyName: string; familyIcon: string }
}

const PASSWORD_ICONS = [
  '🍎', '🍌', '🍊', '🍇', '🍓', '🥕', '🍅', '🥒', '🌽', '🥖',
  '🍖', '🐟', '🍳', '🧀', '🥛', '🍚', '🍜', '🍕', '🍰', '🍪',
  '⚽', '🎾', '🏀', '🎱', '🎸', '🎹', '🎨', '📚', '🚗', '✈️'
]

export default function Login({ onLoginSuccess, onSwitchToRegister, onBack, selectedUser }: LoginProps) {
  const [familyName, setFamilyName] = useState(selectedUser?.familyName || '')
  const [selectedPassword, setSelectedPassword] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleIconClick = (icon: string) => {
    if (selectedPassword.includes(icon)) {
      setSelectedPassword(prev => prev.filter(i => i !== icon))
    } else if (selectedPassword.length < 4) {
      setSelectedPassword(prev => [...prev, icon])
    }
  }

  const handleLogin = async () => {
    if (!familyName.trim()) {
      setError('家族名を入力してください')
      return
    }

    if (selectedPassword.length !== 4) {
      setError('4つの絵を選択してください')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          familyName: familyName.trim(),
          password: selectedPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        onLoginSuccess(data.user)
      } else {
        setError(data.error || 'ログインに失敗しました')
      }
    } catch (error) {
      setError('サーバーに接続できませんでした')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          {selectedUser && (
            <div className="flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="text-4xl mb-2">{selectedUser.familyIcon}</div>
                <div className="text-lg font-medium">{selectedUser.familyName}</div>
              </div>
            </div>
          )}
          <CardTitle className="text-center">
            {selectedUser ? 'パスワードを入力' : 'ログイン'}
          </CardTitle>
          <CardDescription className="text-center">
            {selectedUser 
              ? '4つの絵を順番に選択してください'
              : '家族名と4つの絵でログインしてください'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedUser && (
            <div>
              <label className="block text-sm font-medium mb-2">家族名</label>
              <Input
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="〇〇家"
                className="w-full"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              パスワード（4つの絵を順番に選択）
            </label>
            <div className="grid grid-cols-6 gap-2 mb-4">
              {PASSWORD_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => handleIconClick(icon)}
                  className={`p-2 text-2xl border rounded hover:bg-gray-100 ${
                    selectedPassword.includes(icon)
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
              {selectedPassword.map((icon, index) => (
                <span key={index} className="text-xl">{icon}</span>
              ))}
              <span className="text-sm text-gray-400">
                ({selectedPassword.length}/4)
              </span>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <Button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </Button>

          <div className="text-center space-y-2">
            {onBack && (
              <Button variant="outline" onClick={onBack} className="w-full">
                家族選択に戻る
              </Button>
            )}
            {onSwitchToRegister && (
              <button
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:underline text-sm"
              >
                新規登録はこちら
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}