'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Car, Plus, Users, BarChart3, LogOut } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { api } from '@/lib/api'

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ totalCoches: 0, cochesActivos: 0, totalUsuarios: 0 })
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    const checkAuth = () => {
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const currentUser = JSON.parse(userData)
          setUser(currentUser)
          
          // Migrar usuario actual si no existe en el nuevo sistema
          const users = JSON.parse(localStorage.getItem('users') || '[]')
          const existingUser = users.find((user: any) => user.email === currentUser.email)
          
          if (!existingUser && currentUser.email) {
            const migratedUser = {
              id: currentUser.id || Date.now().toString(),
              email: currentUser.email,
              firstName: currentUser.firstName || currentUser.name || currentUser.email.split('@')[0],
              lastName: '',
              phone: '',
              address: '',
              userType: 'vendedor',
              avatar: '',
              createdAt: new Date().toISOString(),
              isActive: true,
              migrated: true
            }
            users.push(migratedUser)
            localStorage.setItem('users', JSON.stringify(users))
          }
        } catch (error) {
          console.error('Error parsing user data:', error)
          localStorage.removeItem('user')
        }
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    if (!mounted || !user) return

    // Cargar estadísticas
    const loadStats = () => {
      try {
        const cars = JSON.parse(localStorage.getItem('cars') || '[]')
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const userCars = cars.filter((car: any) => car.vendedor?.email === user.email)
        setStats({
          totalCoches: userCars.length,
          cochesActivos: userCars.length,
          totalUsuarios: users.length
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }

    loadStats()
  }, [user, mounted])

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  if (!mounted) {
    return <div>Cargando...</div>
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Debes iniciar sesión para acceder al panel</p>
          <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <img src="/logo.jpg" alt="V&R Autos" className="h-10 w-10 rounded-full" />
              <span className="ml-2 text-xl font-bold text-gray-900">V&R Autos Admin</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Hola, {user.firstName || user.name || 'Usuario'}</span>
              <Link href="/coches" className="btn-secondary">Ver Sitio</Link>
              {(() => {
                const users = JSON.parse(localStorage.getItem('users') || '[]')
                const fullUser = users.find((u: any) => u.email === user.email)
                return fullUser?.userType === 'administrador' ? (
                  <Link href="/super-admin" className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm">
                    Super Admin
                  </Link>
                ) : null
              })()}
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
                <p className="text-sm font-medium text-gray-600">Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsuarios}</p>
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
              <Link href="/perfil" className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center mb-2">
                <Users className="h-4 w-4 mr-2" />
                Editar Perfil
              </Link>
              <Link href="/admin/nuevo" className="w-full btn-primary flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Añadir Nuevo Coche
              </Link>
              <Link href="/admin/mis-coches" className="w-full btn-secondary text-center block">Mis Coches Publicados</Link>
              {(() => {
                const users = JSON.parse(localStorage.getItem('users') || '[]')
                const fullUser = users.find((u: any) => u.email === user.email)
                return fullUser?.userType === 'administrador' ? (
                  <Link href="/admin/gestionar-anuncios" className="w-full bg-red-100 text-red-800 py-2 px-4 rounded-md hover:bg-red-200 text-center block">
                    Gestionar Todos los Anuncios
                  </Link>
                ) : null
              })()}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Gestión de Usuarios</h2>
            <p className="text-gray-600 mb-4">Administra usuarios y vendedores</p>
            <div className="space-y-3">
              <Link href="/admin/nuevo-usuario" className="w-full btn-primary flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Usuario
              </Link>
              <Link href="/admin/usuarios" className="w-full btn-secondary text-center block">Gestionar Usuarios</Link>
              <Link href="/admin/estadisticas" className="w-full btn-secondary text-center block">Ver Estadísticas</Link>
              <button 
                onClick={() => {
                  const cars = JSON.parse(localStorage.getItem('cars') || '[]')
                  if (cars.length > 20) {
                    const recentCars = cars.slice(-20)
                    localStorage.setItem('cars', JSON.stringify(recentCars))
                    alert(`Limpieza completada. Eliminados ${cars.length - 20} coches antiguos.`)
                    window.location.reload()
                  } else {
                    alert('No hay coches antiguos para eliminar.')
                  }
                }}
                className="w-full bg-orange-100 text-orange-800 py-2 px-4 rounded-md hover:bg-orange-200 text-center text-sm"
              >
                Limpiar Almacenamiento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}