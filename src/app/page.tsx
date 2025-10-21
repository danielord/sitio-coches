'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Car, Search, Users, Shield, Heart } from 'lucide-react'
import { CarStorage } from '@/lib/storage'
import SimpleSlideshow from '@/components/SimpleSlideshow'

export default function HomePage() {
  const [recentCars, setRecentCars] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const cars = CarStorage.getAllCars()
    console.log('Cars en homepage:', cars)
    setRecentCars(cars.slice(-6))
    
    // Verificar sesión del usuario
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src="/logo.jpg" alt="V&R Autos" className="h-10 w-10 rounded-full" />
              <span className="ml-2 text-xl font-bold text-gray-900">V&R Autos</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/coches" className="text-gray-500 hover:text-gray-900">Coches</Link>
              <Link href="/favoritos" className="text-gray-500 hover:text-gray-900 flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                Favoritos
              </Link>
              {user ? (
                <>
                  <span className="text-gray-700">Hola, {user.firstName || user.name || 'Usuario'}</span>
                  <Link href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Panel</Link>
                </>
              ) : (
                <>
                  <Link href="/registro" className="text-gray-500 hover:text-gray-900">Registro</Link>
                  <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Iniciar Sesión</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SimpleSlideshow />
        </div>
      </section>

      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">V&R Autos - Tu Concesionario de Confianza 🚗</h1>
          <p className="text-xl mb-8 text-gray-600">La mejor plataforma para comprar y vender coches en México</p>
          <div className="flex justify-center space-x-4">
            <Link href="/coches" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
              Ver Coches
            </Link>
            <Link 
              href={user ? "/admin/nuevo" : "/registro"} 
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white"
            >
              Vender mi Coche
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Coches Recientes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {recentCars.length > 0 ? recentCars.map((car) => (
              <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={car.imagen || `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop`}
                  alt={`${car.marca} ${car.modelo}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{car.marca} {car.modelo}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-2">${car.precio?.toLocaleString()} MXN</p>
                  <p className="text-gray-600 mb-4">{car.año} • {car.kilometraje?.toLocaleString()} km</p>
                  <Link href={`/coche?id=${car.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block">
                    Ver Detalles
                  </Link>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500 text-lg">No hay coches publicados aún</p>
                <Link href="/admin/nuevo" className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-blue-700">
                  Publicar el Primer Coche
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué V&R Autos?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Búsqueda Fácil</h3>
              <p className="text-gray-600">Encuentra el coche perfecto con nuestros filtros avanzados</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Seguridad</h3>
              <p className="text-gray-600">Todos los anuncios son verificados por nuestro equipo</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comunidad</h3>
              <p className="text-gray-600">Conectamos compradores y vendedores de confianza</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}