'use client'

import { useState, useEffect } from 'react'
import UserSetup from '@/components/UserSetup'
import MealPlannerDashboard from '@/components/MealPlannerDashboard'

export default function Home() {
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUserSetup()
  }, [])

  const checkUserSetup = async () => {
    try {
      const response = await fetch('/api/user/preferences?userId=demo-user')
      if (response.ok) {
        setIsSetupComplete(true)
      }
    } catch (error) {
      console.error('Error checking user setup:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSetupComplete = async (preferences: any) => {
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user',
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

  if (!isSetupComplete) {
    return <UserSetup onComplete={handleSetupComplete} />
  }

  return <MealPlannerDashboard />
}
