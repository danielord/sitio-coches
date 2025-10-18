'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Car, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import AnimatedSection from '@/components/AnimatedSection'
import { CarCardSkeleton } from '@/components/LoadingSkeleton'

export default function CochesPage() {
  const [coches, setCoches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCoches = async () => {
      try {
        const data = await api.getCoches()
        setCoches(data)
      } catch (error) {
        console.error('Error loading coches:', error)
      }
      setLoading(false)
    }

    loadCoches()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="flex items-center">
                <Car className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">SitioCoches</span>
              </Link>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
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
              <Car className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SitioCoches</span>
            </Link>
            <Link href="/admin" className="btn-primary">Admin</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros */}
          <aside className="lg:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 text-gray-500 mr-2" />
                <h2 className="text-lg font-semibold">Filtros</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="">Todas las marcas</option>
                    <option value="toyota">Toyota</option>
                    <option value="volkswagen">Volkswagen</option>
                    <option value="ford">Ford</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio máximo</label>
                  <input type="number" placeholder="€" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Año mínimo</label>
                  <input type="number" placeholder="2020" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                
                <button className="w-full btn-primary">Aplicar Filtros</button>
              </div>
            </div>
          </aside>

          {/* Lista de coches */}
          <main className="lg:w-3/4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Coches Disponibles</h1>
              <p className="text-gray-600">Encuentra tu próximo coche</p>
            </div>

            {coches.length === 0 ? (
              <AnimatedSection className="text-center py-12">
                <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay coches disponibles</h3>
                <p className="text-gray-600">Prueba con otros filtros o vuelve más tarde</p>
              </AnimatedSection>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {coches.map((coche, index) => (
                  <AnimatedSection
                    key={coche.id}
                    delay={index * 0.1}
                    className="group"
                  >
                    <motion.div
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300"
                      whileHover={{ y: -5 }}
                    >
                      <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                        {coche.imagenes.length > 0 ? (
                          <Image
                            src={coche.imagenes[0]}
                            alt={`${coche.marca} ${coche.modelo}`}
                            width={300}
                            height={200}
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
                          €{coche.precio.toLocaleString()}
                        </p>
                        <Link
                          href={`/coches/${coche.id}`}
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
          </main>
        </div>
      </div>
    </div>
  )
}