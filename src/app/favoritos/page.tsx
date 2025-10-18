'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Car, Heart, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { favoritesManager } from '@/lib/favorites'
import AnimatedSection from '@/components/AnimatedSection'
import FavoriteButton from '@/components/FavoriteButton'

export default function FavoritosPage() {
  const [favoriteCoches, setFavoriteCoches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavorites()

    // Escuchar cambios en favoritos
    const handleFavoritesChange = () => {
      loadFavorites()
    }

    window.addEventListener('favoritesChanged', handleFavoritesChange)
    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChange)
    }
  }, [])

  const loadFavorites = async () => {
    setLoading(true)
    try {
      const favoriteIds = favoritesManager.getFavorites()
      if (favoriteIds.length === 0) {
        setFavoriteCoches([])
        setLoading(false)
        return
      }

      const promises = favoriteIds.map(id => api.getCoche(id).catch(() => null))
      const results = await Promise.all(promises)
      const validCoches = results.filter(Boolean)
      
      setFavoriteCoches(validCoches)
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
    setLoading(false)
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
            <Link href="/coches" className="btn-secondary flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Coches
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatedSection className="mb-8">
          <div className="flex items-center mb-2">
            <Heart className="h-8 w-8 text-red-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Mis Favoritos</h1>
          </div>
          <p className="text-gray-600">
            {favoriteCoches.length} coches guardados
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando favoritos...</p>
          </div>
        ) : favoriteCoches.length === 0 ? (
          <AnimatedSection className="text-center py-16">
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No tienes favoritos aún
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Explora nuestro catálogo y guarda los coches que más te gusten haciendo clic en el corazón
            </p>
            <Link href="/coches" className="btn-primary">
              Explorar Coches
            </Link>
          </AnimatedSection>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favoriteCoches.map((coche, index) => (
              <AnimatedSection
                key={coche.id}
                delay={index * 0.1}
                className="group"
              >
                <motion.div
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 relative"
                  whileHover={{ y: -5 }}
                >
                  {/* Botón de favorito */}
                  <div className="absolute top-3 right-3 z-10">
                    <FavoriteButton 
                      cocheId={coche.id} 
                      className="bg-white/90 hover:bg-white shadow-sm"
                    />
                  </div>

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
      </div>
    </div>
  )
}