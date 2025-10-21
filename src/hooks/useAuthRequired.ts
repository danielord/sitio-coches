'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuthRequired() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('user')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } else {
          // Redirigir al login si no hay usuario
          router.push('/login')
          return
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        router.push('/login')
        return
      }
      setLoading(false)
    }

    checkAuth()
  }, [router])

  return { user, loading }
}