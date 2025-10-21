'use client'

import { useAuthRequired } from '@/hooks/useAuthRequired'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthRequired()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // El hook ya redirige al login
  }

  return <>{children}</>
}