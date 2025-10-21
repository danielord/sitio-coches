'use client'

import { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('user')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          
          // Verificar si la sesión no es muy antigua (7 días)
          const loginTime = parsedUser.loginTime || 0
          const now = new Date().getTime()
          const daysDiff = (now - loginTime) / (1000 * 60 * 60 * 24)
          
          if (daysDiff < 7) {
            // Renovar timestamp si han pasado más de 1 día
            if (daysDiff > 1) {
              const renewedUser = { ...parsedUser, loginTime: now }
              localStorage.setItem('user', JSON.stringify(renewedUser))
              setUser(renewedUser)
            } else {
              setUser(parsedUser)
            }
          } else {
            localStorage.removeItem('user')
          }
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
      setLoading(false)
    }

    checkAuth()
    
    // Verificar sesión cada 30 minutos
    const interval = setInterval(checkAuth, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const login = (userData: any) => {
    const userWithTimestamp = {
      ...userData,
      loginTime: new Date().getTime()
    }
    localStorage.setItem('user', JSON.stringify(userWithTimestamp))
    setUser(userWithTimestamp)
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const renewSession = () => {
    if (user) {
      const renewedUser = { ...user, loginTime: new Date().getTime() }
      localStorage.setItem('user', JSON.stringify(renewedUser))
      setUser(renewedUser)
    }
  }

  return { user, loading, login, logout, renewSession }
}