'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Car, Plus, Users, BarChart3, LogOut } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { api } from '@/lib/api'

export default function AdminPage() {
  const [auth, setAuth] = useState(authClient.getAuth())
  const [stats, setStats] = useState({ totalCoches: 0, cochesActivos: 0 })
  const router = useRouter()

  useEffect(() => {
    if (!auth.user) {
      router.push('/auth/login')
      return
    }

    // Cargar estadísticas
    const loadStats = async () => {
      try {
        const vendedores = await api.getVendedores(auth.user!.email)
        const vendedor = vendedores[0]
        if (vendedor?.coches) {
          setStats({
            totalCoches: vendedor.coches.length,
            cochesActivos: vendedor.coches.filter((c: any) => c.activo).length
          })
        }
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }

    loadStats()
  }, [auth.user, router])

  const handleLogout = () => {
    authClient.clearAuth()
    router.push('/')
  }

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
              <span className="ml-2 text-xl font-bold text-gray-900">SitioCoches Admin</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Hola, {auth.user.name}</span>
              <Link href="/coches" className="btn-secondary">Ver Sitio</Link>
              <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona coches y vendedores</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Coches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCoches}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vendedores</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cochesActivos}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Gestión de Coches</h2>
            <p className="text-gray-600 mb-4">Añade, edita o elimina anuncios de coches</p>
            <div className="space-y-3">
              <Link href="/admin/nuevo" className="w-full btn-primary flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Añadir Nuevo Coche
              </Link>
              <Link href="/admin/dashboard" className="w-full btn-secondary text-center block">Ver Todos los Coches</Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Gestión de Vendedores</h2>
            <p className="text-gray-600 mb-4">Administra los vendedores registrados</p>
            <div className="space-y-3">
              <button className="w-full btn-primary flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Vendedor
              </button>
              <Link href="/admin/estadisticas" className="w-full btn-secondary text-center block">Ver Estadísticas</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}