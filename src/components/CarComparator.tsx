'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Scale, Calendar, Gauge, Fuel, Settings, Euro } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/lib/api'

interface CompareItem {
  id: string
  marca: string
  modelo: string
  año: number
  precio: number
  kilometraje: number
  combustible: string
  transmision: string
  imagenes: string[]
}

export default function CarComparator() {
  const [isOpen, setIsOpen] = useState(false)
  const [compareList, setCompareList] = useState<string[]>([])
  const [compareData, setCompareData] = useState<CompareItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('car_compare')
    if (stored) {
      const list = JSON.parse(stored)
      setCompareList(list)
      if (list.length > 0) {
        loadCompareData(list)
      }
    }

    // Escuchar eventos de comparación
    const handleCompareChange = (event: CustomEvent) => {
      const { action, cocheId } = event.detail
      if (action === 'add') {
        addToCompare(cocheId)
      } else if (action === 'remove') {
        removeFromCompare(cocheId)
      }
    }

    window.addEventListener('compareChanged', handleCompareChange as EventListener)
    return () => {
      window.removeEventListener('compareChanged', handleCompareChange as EventListener)
    }
  }, [])

  const loadCompareData = async (ids: string[]) => {
    setLoading(true)
    try {
      const promises = ids.map(id => api.getCoche(id))
      const results = await Promise.all(promises)
      setCompareData(results.filter(Boolean))
    } catch (error) {
      console.error('Error loading compare data:', error)
    }
    setLoading(false)
  }

  const addToCompare = (cocheId: string) => {
    if (compareList.includes(cocheId) || compareList.length >= 3) return
    
    const newList = [...compareList, cocheId]
    setCompareList(newList)
    localStorage.setItem('car_compare', JSON.stringify(newList))
    loadCompareData(newList)
  }

  const removeFromCompare = (cocheId: string) => {
    const newList = compareList.filter(id => id !== cocheId)
    setCompareList(newList)
    localStorage.setItem('car_compare', JSON.stringify(newList))
    setCompareData(prev => prev.filter(car => car.id !== cocheId))
  }

  const clearAll = () => {
    setCompareList([])
    setCompareData([])
    localStorage.removeItem('car_compare')
  }

  if (compareList.length === 0) return null

  return (
    <>
      {/* Botón flotante */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="flex items-center">
          <Scale className="h-6 w-6" />
          <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {compareList.length}
          </span>
        </div>
      </motion.button>

      {/* Modal comparador */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">Comparar Coches</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearAll}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Limpiar todo
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
                {loading ? (
                  <div className="text-center py-8">Cargando comparación...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {compareData.map((car) => (
                      <div key={car.id} className="border rounded-lg overflow-hidden">
                        {/* Imagen */}
                        <div className="relative h-48">
                          {car.imagenes.length > 0 ? (
                            <Image
                              src={car.imagenes[0]}
                              alt={`${car.marca} ${car.modelo}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="bg-gray-200 h-full flex items-center justify-center">
                              <span className="text-gray-400">Sin imagen</span>
                            </div>
                          )}
                          <button
                            onClick={() => removeFromCompare(car.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Información */}
                        <div className="p-4 space-y-3">
                          <h3 className="font-bold text-lg">
                            {car.marca} {car.modelo}
                          </h3>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center text-gray-600">
                                <Euro className="h-4 w-4 mr-1" />
                                Precio
                              </span>
                              <span className="font-semibold text-primary-600">
                                €{car.precio.toLocaleString()}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="flex items-center text-gray-600">
                                <Calendar className="h-4 w-4 mr-1" />
                                Año
                              </span>
                              <span>{car.año}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="flex items-center text-gray-600">
                                <Gauge className="h-4 w-4 mr-1" />
                                Kilometraje
                              </span>
                              <span>{car.kilometraje.toLocaleString()} km</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="flex items-center text-gray-600">
                                <Fuel className="h-4 w-4 mr-1" />
                                Combustible
                              </span>
                              <span>{car.combustible}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="flex items-center text-gray-600">
                                <Settings className="h-4 w-4 mr-1" />
                                Transmisión
                              </span>
                              <span>{car.transmision}</span>
                            </div>
                          </div>

                          <Link
                            href={`/coches/${car.id}`}
                            className="block w-full text-center btn-primary mt-4"
                          >
                            Ver Detalles
                          </Link>
                        </div>
                      </div>
                    ))}

                    {/* Slot para añadir más */}
                    {compareData.length < 3 && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500">
                        <Plus className="h-12 w-12 mb-2" />
                        <p>Añade otro coche</p>
                        <p className="text-sm">para comparar</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Hook para usar el comparador
export const useComparator = () => {
  const addToCompare = (cocheId: string) => {
    window.dispatchEvent(new CustomEvent('compareChanged', {
      detail: { action: 'add', cocheId }
    }))
  }

  const removeFromCompare = (cocheId: string) => {
    window.dispatchEvent(new CustomEvent('compareChanged', {
      detail: { action: 'remove', cocheId }
    }))
  }

  return { addToCompare, removeFromCompare }
}