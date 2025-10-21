'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Car, ArrowLeft, TrendingUp, Eye, Heart, Calendar } from 'lucide-react'

export default function EstadisticasPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalCoches: 0,
    cochesActivos: 0,
    vistasPromedio: 0,
    favoritosTotal: 0,
    cocheMasPopular: null as any,
    ventasEsteMes: 0
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      loadStats(parsedUser)
    } else {
      router.push('/login')
    }
  }, [])

  const loadStats = (currentUser: any) => {
    const cars = JSON.parse(localStorage.getItem('cars') || '[]')
    const userCars = cars.filter((car: any) => car.vendedor?.email === currentUser.email)
    
    // Simular estadísticas
    const totalViews = userCars.length * Math.floor(Math.random() * 50) + 10
    const totalFavorites = userCars.length * Math.floor(Math.random() * 5) + 1
    
    setStats({
      totalCoches: userCars.length,
      cochesActivos: userCars.length,
      vistasPromedio: Math.floor(totalViews / Math.max(userCars.length, 1)),
      favoritosTotal: totalFavorites,
      cocheMasPopular: userCars.length > 0 ? userCars[0] : null,
      ventasEsteMes: Math.floor(Math.random() * 3)
    })
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <img src="/logo.jpg" alt="V&R Autos" className="h-10 w-10 rounded-full" />
              <span className="ml-2 text-xl font-bold text-gray-900">V&R Autos - Estadísticas</span>
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

        {/* Tarjetas de estadísticas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Coches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCoches}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vistas Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.vistasPromedio}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Favoritos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.favoritosTotal}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ventas Este Mes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ventasEsteMes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coche más popular */}
        {stats.cocheMasPopular && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Coche Más Popular
            </h3>
            <div className="flex items-center space-x-4">
              <img
                src={stats.cocheMasPopular.imagen || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=100&h=100&fit=crop'}
                alt={`${stats.cocheMasPopular.marca} ${stats.cocheMasPopular.modelo}`}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h4 className="text-xl font-semibold">
                  {stats.cocheMasPopular.marca} {stats.cocheMasPopular.modelo} {stats.cocheMasPopular.año}
                </h4>
                <p className="text-gray-600">
                  ${stats.cocheMasPopular.precio?.toLocaleString()} MXN
                </p>
                <p className="text-sm text-green-600">
                  {stats.vistasPromedio + 15} vistas • {Math.floor(stats.favoritosTotal / 2)} favoritos
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Consejos para mejorar */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">💡 Consejos para Mejorar tus Ventas</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📸 Mejores Fotos</h4>
              <p className="text-sm text-blue-700">Sube hasta 5 imágenes de alta calidad desde diferentes ángulos</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">📝 Descripción Detallada</h4>
              <p className="text-sm text-green-700">Incluye historial de mantenimiento y características especiales</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">💰 Precio Competitivo</h4>
              <p className="text-sm text-purple-700">Investiga precios similares en el mercado</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">⚡ Respuesta Rápida</h4>
              <p className="text-sm text-orange-700">Responde a consultas en menos de 2 horas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}