'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Car, Edit, Trash2, Eye } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function MisCochesPage() {
  const { user, loading } = useAuth()
  const [coches, setCoches] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      const allCars = JSON.parse(localStorage.getItem('cars') || '[]')
      
      // Migrar todos los coches al usuario actual si no tienen vendedor asignado
      let needsUpdate = false
      const updatedCars = allCars.map((car: any) => {
        if (!car.vendedor?.email) {
          needsUpdate = true
          return {
            ...car,
            vendedor: {
              nombre: user.name || 'Vendedor V&R',
              telefono: '+52 55 1234 5678',
              email: user.email
            }
          }
        }
        return car
      })
      
      if (needsUpdate) {
        localStorage.setItem('cars', JSON.stringify(updatedCars))
      }
      
      const userCars = updatedCars.filter((car: any) => car.vendedor?.email === user.email)
      setCoches(userCars)
    }
  }, [user])

  const deleteCar = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este coche?')) {
      const allCars = JSON.parse(localStorage.getItem('cars') || '[]')
      const updatedCars = allCars.filter((car: any) => car.id !== id)
      localStorage.setItem('cars', JSON.stringify(updatedCars))
      setCoches(coches.filter(car => car.id !== id))
    }
  }

  if (loading) return <div>Cargando...</div>

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Debes iniciar sesión</p>
          <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md">
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
              <span className="ml-2 text-xl font-bold text-gray-900">V&R Autos</span>
            </Link>
            <Link href="/admin" className="text-blue-600 hover:text-blue-500">
              Volver al Admin
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Coches Publicados</h1>
          <p className="text-gray-600">Gestiona tus anuncios de coches</p>
        </div>

        {coches.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes coches publicados</h3>
            <Link href="/admin/nuevo" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Publicar mi Primer Coche
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {coches.map((coche) => (
              <div key={coche.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={coche.imagen || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=100&h=100&fit=crop'}
                      alt={`${coche.marca} ${coche.modelo}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">
                        {coche.marca} {coche.modelo} {coche.año}
                      </h3>
                      <p className="text-gray-600">
                        ${coche.precio?.toLocaleString()} MXN • {coche.kilometraje?.toLocaleString()} km
                      </p>
                      <p className="text-sm text-gray-500">
                        Publicado: {new Date(coche.fechaCreacion).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      href={`/coche?id=${coche.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      title="Ver anuncio"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link
                      href={`/admin/editar?id=${coche.id}`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                      title="Editar"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => deleteCar(coche.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      title="Eliminar"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}