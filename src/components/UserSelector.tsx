'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Login from './Login'
import Register from './Register'

interface User {
  id: string
  familyName: string
  familyIcon: string
}

interface UserSelectorProps {
  onLoginSuccess: (user: User) => void
  onSwitchToRegister: () => void
}

export default function UserSelector({ onLoginSuccess, onSwitchToRegister }: UserSelectorProps) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/auth/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    setShowLogin(true)
  }

  if (showLogin && selectedUser) {
    return (
      <Login
        selectedUser={selectedUser}
        onLoginSuccess={onLoginSuccess}
        onBack={() => {
          setShowLogin(false)
          setSelectedUser(null)
        }}
      />
    )
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">家族を選択</CardTitle>
          <CardDescription className="text-center">
            ログインする家族を選んでください
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">まだ登録された家族がいません</p>
              <Button onClick={onSwitchToRegister}>
                最初の家族を登録する
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {users.map((user) => (
                  <Card
                    key={user.id}
                    className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-300"
                    onClick={() => handleUserSelect(user)}
                  >
                    <CardContent className="flex items-center justify-center p-6">
                      <div className="text-center">
                        <div className="text-4xl mb-2">{user.familyIcon}</div>
                        <div className="font-medium text-lg">{user.familyName}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center">
                <Button variant="outline" onClick={onSwitchToRegister}>
                  新しい家族を登録
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}