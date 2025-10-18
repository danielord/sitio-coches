'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Car, ArrowLeft } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import VendorStats from '@/components/VendorStats'

export default function EstadisticasPage() {
  const [auth, setAuth] = useState(authClient.getAuth())
  const router = useRouter()

  useEffect(() => {
    if (!auth.user) {
      router.push('/auth/login')
    }
  }, [auth.user, router])

  if (!auth.user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <Car className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Estadísticas</span>
            </Link>
            <Link href="/admin" className="btn-secondary flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Admin
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Estadísticas</h1>
          <p className="text-gray-600">Analiza el rendimiento de tus anuncios</p>
        </div>

        <VendorStats vendedorId={auth.user.id} />
      </div>
    </div>
  )
}