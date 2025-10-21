'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Eye, Car } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function GestionarAnunciosPage() {
  const [coches, setCoches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    const cars = JSON.parse(localStorage.getItem('cars') || '[]')
    setCoches(cars)
    setLoading(false)
  }, [])

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
      const updatedCars = coches.filter(car => car.id !== id)
      localStorage.setItem('cars', JSON.stringify(updatedCars))
      setCoches(updatedCars)
    }
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  // Verificar si es administrador
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const fullUser = users.find((u: any) => u.email === user?.email)
  
  if (fullUser?.userType !== 'administrador') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">Solo los administradores pueden acceder a esta página</p>
          <Link href="/admin" className="btn-primary">Volver al Panel</Link>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="flex items-center">
                <img src="/logo.jpg" alt="V&R Autos" className="h-10 w-10 rounded-full" />
                <span className="ml-2 text-xl font-bold text-gray-900">V&R Autos - Gestión de Anuncios</span>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestionar Todos los Anuncios</h1>
            <p className="text-gray-600">Como administrador, puedes editar o eliminar cualquier anuncio</p>
          </div>

          {coches.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay anuncios publicados</h3>
              <p className="text-gray-600">Cuando se publiquen anuncios aparecerán aquí</p>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Total de anuncios: {coches.length}
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {coches.map((coche) => (
                  <div key={coche.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={coche.imagen || '/placeholder-car.jpg'}
                          alt={`${coche.marca} ${coche.modelo}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {coche.marca} {coche.modelo} {coche.año}
                          </h3>
                          <p className="text-gray-600">
                            ${coche.precio?.toLocaleString()} MXN • {coche.kilometraje?.toLocaleString()} km
                          </p>
                          <p className="text-sm text-gray-500">
                            Publicado por: {coche.vendedor?.nombre || 'Usuario'} ({coche.vendedor?.email})
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(coche.fechaCreacion).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/coche?id=${coche.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                          title="Ver anuncio"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        
                        <Link
                          href={`/admin/editar?id=${coche.id}`}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-md"
                          title="Editar anuncio"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(coche.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                          title="Eliminar anuncio"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}