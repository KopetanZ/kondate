'use client'

import { useState, useEffect } from 'react'
import UserSelector from '@/components/UserSelector'
import Register from '@/components/Register'
import UserSetup from '@/components/UserSetup'
import MealPlannerDashboard from '@/components/MealPlannerDashboard'

interface User {
  id: string
  familyName: string
  familyIcon: string
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showRegister, setShowRegister] = useState(false)
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ローカルストレージからユーザー情報を復元
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setCurrentUser(user)
      checkUserSetup(user.id)
    } else {
      setLoading(false)
    }
  }, [])

  const checkUserSetup = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/preferences?userId=${userId}`)
      if (response.ok) {
        setIsSetupComplete(true)
      }
    } catch (error) {
      console.error('Error checking user setup:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
    checkUserSetup(user.id)
  }

  const handleRegisterSuccess = (user: User) => {
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
    setLoading(false)
    setIsSetupComplete(false) // 新規ユーザーは設定が必要
  }

  const handleSetupComplete = async (preferences: any) => {
    if (!currentUser) return

    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          ...preferences
        })
      })

      if (response.ok) {
        setIsSetupComplete(true)
      } else {
        console.error('Failed to save preferences')
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsSetupComplete(false)
    localStorage.removeItem('currentUser')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>読み込み中...</p>
        </div>
      </div>
    )
  }

  // ユーザーがログインしていない場合
  if (!currentUser) {
    if (showRegister) {
      return (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      )
    } else {
      return (
        <UserSelector
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setShowRegister(true)}
        />
      )
    }
  }

  // ユーザーはログイン済みだが設定未完了
  if (!isSetupComplete) {
    return <UserSetup onComplete={handleSetupComplete} currentUser={currentUser} onLogout={handleLogout} />
  }

  // すべて完了済み
  return <MealPlannerDashboard currentUser={currentUser} onLogout={handleLogout} />
}
