'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Car, Scale } from 'lucide-react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import AnimatedSection from '@/components/AnimatedSection'
import { CarCardSkeleton } from '@/components/LoadingSkeleton'
import SearchFilters from '@/components/SearchFilters'
import FavoriteButton from '@/components/FavoriteButton'
import CarComparator, { useComparator } from '@/components/CarComparator'

export default function CochesPage() {
  const [coches, setCoches] = useState<any[]>([])
  const [filteredCoches, setFilteredCoches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<any>({})
  const { addToCompare } = useComparator()

  useEffect(() => {
    const loadCoches = async () => {
      try {
        const response = await api.getCoches()
        const data = response.cars || []
        console.log('Coches cargados desde API:', data)
        setCoches(data)
        setFilteredCoches(data)
      } catch (error) {
        console.error('Error loading coches:', error)
        // Fallback a datos demo si falla la API
        const cochesDemo = [
          {
            id: 'demo-1',
            marca: 'Toyota',
            modelo: 'Corolla',
            año: 2020,
            precio: 280000,
            kilometraje: 45000,
            combustible: 'Gasolina',
            transmision: 'Manual',
            color: 'Blanco',
            descripcion: 'Excelente estado, un solo dueño',
            imagen: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop',
            vendedor_nombre: 'Demo V&R',
            vendedor_telefono: '+52 55 1234 5678',
            vendedor_email: 'demo@vrautos.com',
            created_at: new Date().toISOString()
          }
        ]
        setCoches(cochesDemo)
        setFilteredCoches(cochesDemo)
      }
      setLoading(false)
    }

    loadCoches()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, coches])

  const applyFilters = () => {
    let filtered = [...coches]

    // Búsqueda por texto
    if (filters.busqueda) {
      const search = filters.busqueda.toLowerCase()
      filtered = filtered.filter(coche => 
        coche.marca.toLowerCase().includes(search) ||
        coche.modelo.toLowerCase().includes(search)
      )
    }

    // Filtros específicos
    if (filters.marca) {
      filtered = filtered.filter(coche => coche.marca === filters.marca)
    }
    if (filters.precioMin) {
      filtered = filtered.filter(coche => coche.precio >= parseFloat(filters.precioMin))
    }
    if (filters.precioMax) {
      filtered = filtered.filter(coche => coche.precio <= parseFloat(filters.precioMax))
    }
    if (filters.añoMin) {
      filtered = filtered.filter(coche => coche.año >= parseInt(filters.añoMin))
    }
    if (filters.añoMax) {
      filtered = filtered.filter(coche => coche.año <= parseInt(filters.añoMax))
    }
    if (filters.combustible) {
      filtered = filtered.filter(coche => coche.combustible === filters.combustible)
    }
    if (filters.transmision) {
      filtered = filtered.filter(coche => coche.transmision === filters.transmision)
    }
    if (filters.kilometrajeMax) {
      filtered = filtered.filter(coche => coche.kilometraje <= parseInt(filters.kilometrajeMax))
    }

    setFilteredCoches(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="flex items-center">
                <img src="/logo.jpg" alt="V&R Autos" className="h-10 w-10 rounded-full" />
                <span className="ml-2 text-xl font-bold text-gray-900">V&R Autos</span>
              </Link>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SearchFilters onFiltersChange={setFilters} loading={loading} />
          <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
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
            <Link href="/admin" className="btn-primary">Admin</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchFilters onFiltersChange={setFilters} loading={loading} />
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Coches Disponibles - V&R Autos 2024</h1>
            <p className="text-gray-600">
              {filteredCoches.length} coches encontrados
            </p>
          </div>
        </div>

        {filteredCoches.length === 0 ? (
          <AnimatedSection className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay coches disponibles</h3>
            <p className="text-gray-600 mb-4">Prueba con otros filtros o vuelve más tarde</p>
            <button
              onClick={() => {
                const userData = localStorage.getItem('user')
                if (userData) {
                  const user = JSON.parse(userData)
                  const allCars = JSON.parse(localStorage.getItem('cars') || '[]')
                  
                  const userCars = [{
                    id: `user-${Date.now()}-1`,
                    marca: 'Nissan',
                    modelo: 'Sentra',
                    año: 2021,
                    precio: 250000,
                    kilometraje: 35000,
                    combustible: 'Gasolina',
                    transmision: 'Automática',
                    color: 'Gris',
                    descripcion: 'Excelente estado, mantenimiento al día',
                    imagen: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop',
                    vendedor: {
                      nombre: user.firstName || user.name || 'Usuario V&R',
                      telefono: '+52 55 1234 5678',
                      email: user.email
                    },
                    fechaCreacion: new Date().toISOString(),
                    enSlideshow: false
                  }]
                  
                  localStorage.setItem('cars', JSON.stringify([...allCars, ...userCars]))
                  window.location.reload()
                } else {
                  alert('Debes iniciar sesión para recuperar tus coches')
                }
              }}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 text-sm"
            >
              🔄 Recuperar mis coches
            </button>
          </AnimatedSection>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCoches.map((coche, index) => (
              <AnimatedSection
                key={coche.id}
                delay={index * 0.1}
                className="group"
              >
                <motion.div
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 relative"
                  whileHover={{ y: -5 }}
                >
                  {/* Botones de acción */}
                  <div className="absolute top-3 right-3 z-10 flex gap-2">
                    <FavoriteButton 
                      cocheId={coche.id} 
                      className="bg-white/90 hover:bg-white shadow-sm"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        addToCompare(coche.id)
                      }}
                      className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-all duration-200"
                    >
                      <Scale className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                    {coche.imagen ? (
                      <img
                        src={coche.imagen}
                        alt={`${coche.marca} ${coche.modelo}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <Car className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">
                      {coche.marca} {coche.modelo} {coche.año}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {coche.kilometraje.toLocaleString()} km • {coche.combustible}
                    </p>
                    <p className="text-primary-600 font-bold text-xl mt-2">
                      ${coche.precio.toLocaleString()} MXN
                    </p>
                    <Link
                      href={`/coche?id=${coche.id}`}
                      className="w-full mt-3 btn-primary text-center block transform hover:scale-105 transition-transform duration-200"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
      
      <CarComparator />
    </div>
  )
}