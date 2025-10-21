'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Car, Users, BarChart3, LogOut, Settings, Image, CheckCircle, XCircle } from 'lucide-react'

export default function SuperAdminPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ 
    totalCoches: 0, 
    cochesActivos: 0, 
    totalUsuarios: 0,
    cochesPendientes: 0,
    slideshowItems: 0
  })
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const userData = localStorage.getItem('user')
    if (userData) {
      const currentUser = JSON.parse(userData)
      setUser(currentUser)
      
      // Verificar si es administrador
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const fullUser = users.find((u: any) => u.email === currentUser.email)
      
      if (!fullUser || fullUser.userType !== 'administrador') {
        alert('Acceso denegado. Solo administradores pueden acceder.')
        router.push('/')
        return
      }
    }
  }, [router])

  useEffect(() => {
    if (!mounted || !user) return

    const loadStats = () => {
      try {
        const cars = JSON.parse(localStorage.getItem('cars') || '[]')
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const slideshow = JSON.parse(localStorage.getItem('slideshow') || '[]')
        
        const pendingCars = cars.filter((car: any) => car.status === 'pending')
        const activeCars = cars.filter((car: any) => car.status !== 'rejected')
        
        setStats({
          totalCoches: cars.length,
          cochesActivos: activeCars.length,
          totalUsuarios: users.length,
          cochesPendientes: pendingCars.length,
          slideshowItems: slideshow.length
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
          <p className="mb-4">Debes iniciar sesión como administrador</p>
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
              <span className="ml-2 text-xl font-bold text-gray-900">V&R Autos - Super Admin</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Admin: {user.firstName || user.name || 'Usuario'}</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Panel de Super Administración</h1>
          <p className="text-gray-600">Control total del sitio V&R Autos</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
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
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cochesActivos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cochesPendientes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsuarios}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Image className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Slideshow</p>
                <p className="text-2xl font-bold text-gray-900">{stats.slideshowItems}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Gestión de Contenido</h2>
            <p className="text-gray-600 mb-4">Administra anuncios y slideshow</p>
            <div className="space-y-3">
              <Link href="/super-admin/anuncios" className="w-full btn-primary flex items-center justify-center">
                <Car className="h-4 w-4 mr-2" />
                Aprobar Anuncios
              </Link>
              <Link href="/super-admin/slideshow" className="w-full btn-secondary text-center block">
                <Image className="h-4 w-4 inline mr-2" />
                Gestionar Slideshow
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Gestión de Usuarios</h2>
            <p className="text-gray-600 mb-4">Administra todos los usuarios del sitio</p>
            <div className="space-y-3">
              <Link href="/admin/usuarios" className="w-full btn-primary flex items-center justify-center">
                <Users className="h-4 w-4 mr-2" />
                Gestionar Usuarios
              </Link>
              <Link href="/admin/nuevo-usuario" className="w-full btn-secondary text-center block">
                Crear Usuario
              </Link>
              <Link href="/admin/estadisticas" className="w-full btn-secondary text-center block">
                <BarChart3 className="h-4 w-4 inline mr-2" />
                Ver Estadísticas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}