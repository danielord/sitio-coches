'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Car, CheckCircle, XCircle, Eye, Clock } from 'lucide-react'

export default function AnunciosPage() {
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending') // pending, approved, rejected, all

  useEffect(() => {
    loadCars()
  }, [])

  const loadCars = () => {
    try {
      const carsData = JSON.parse(localStorage.getItem('cars') || '[]')
      // Agregar status si no existe
      const carsWithStatus = carsData.map((car: any) => ({
        ...car,
        status: car.status || 'approved' // Los coches existentes se consideran aprobados
      }))
      setCars(carsWithStatus)
      localStorage.setItem('cars', JSON.stringify(carsWithStatus))
    } catch (error) {
      console.error('Error loading cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateCarStatus = (carId: string, status: 'approved' | 'rejected') => {
    const updatedCars = cars.map(car => 
      car.id === carId ? { ...car, status, reviewedAt: new Date().toISOString() } : car
    )
    setCars(updatedCars)
    localStorage.setItem('cars', JSON.stringify(updatedCars))
  }

  const getFilteredCars = () => {
    switch (filter) {
      case 'pending':
        return cars.filter(car => car.status === 'pending')
      case 'approved':
        return cars.filter(car => car.status === 'approved')
      case 'rejected':
        return cars.filter(car => car.status === 'rejected')
      default:
        return cars
    }
  }

  const filteredCars = getFilteredCars()
  const pendingCount = cars.filter(car => car.status === 'pending').length
  const approvedCount = cars.filter(car => car.status === 'approved').length
  const rejectedCount = cars.filter(car => car.status === 'rejected').length

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/super-admin" className="flex items-center">
              <img src="/logo.jpg" alt="V&R Autos" className="h-10 w-10 rounded-full" />
              <span className="ml-2 text-xl font-bold text-gray-900">Gestión de Anuncios</span>
            </Link>
            <Link href="/super-admin" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Panel
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Anuncios</h1>
          <p className="text-gray-600">Aprueba o rechaza anuncios de coches</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aprobados</p>
                <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rechazados</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{cars.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'pending' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendientes ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'approved' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Aprobados ({approvedCount})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'rejected' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rechazados ({rejectedCount})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'all' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({cars.length})
            </button>
          </div>
        </div>

        {/* Lista de Anuncios */}
        {filteredCars.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay anuncios {filter === 'all' ? '' : filter === 'pending' ? 'pendientes' : filter === 'approved' ? 'aprobados' : 'rechazados'}
            </h3>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <div key={car.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative">
                  <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                    {car.imagen || car.imagenes?.[0] ? (
                      <img
                        src={car.imagen || car.imagenes?.[0]}
                        alt={`${car.marca} ${car.modelo}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Car className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      car.status === 'pending' 
                        ? 'bg-orange-100 text-orange-800'
                        : car.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {car.status === 'pending' ? 'Pendiente' : car.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg">
                    {car.marca} {car.modelo} {car.año}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {car.kilometraje?.toLocaleString()} km • {car.combustible}
                  </p>
                  <p className="text-primary-600 font-bold text-xl mt-2">
                    ${car.precio?.toLocaleString()} MXN
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Vendedor: {car.vendedor?.nombre || car.vendedor?.email || 'N/A'}
                  </p>
                  
                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/coche?id=${car.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-200 text-center text-sm"
                    >
                      <Eye className="h-4 w-4 inline mr-1" />
                      Ver
                    </Link>
                    {car.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateCarStatus(car.id, 'approved')}
                          className="flex-1 bg-green-100 text-green-800 py-2 px-3 rounded-md hover:bg-green-200 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 inline mr-1" />
                          Aprobar
                        </button>
                        <button
                          onClick={() => updateCarStatus(car.id, 'rejected')}
                          className="flex-1 bg-red-100 text-red-800 py-2 px-3 rounded-md hover:bg-red-200 text-sm"
                        >
                          <XCircle className="h-4 w-4 inline mr-1" />
                          Rechazar
                        </button>
                      </>
                    )}
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