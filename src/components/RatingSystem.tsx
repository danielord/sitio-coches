'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, MessageSquare, User } from 'lucide-react'

interface Rating {
  id: string
  puntuacion: number
  comentario?: string
  nombreUsuario: string
  fechaCreacion: string
}

interface RatingStats {
  total: number
  promedio: number
  cinco_estrellas: number
  cuatro_estrellas: number
  tres_estrellas: number
  dos_estrellas: number
  una_estrella: number
}

interface RatingSystemProps {
  cocheId: string
}

export default function RatingSystem({ cocheId }: RatingSystemProps) {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [stats, setStats] = useState<RatingStats | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [newRating, setNewRating] = useState({
    puntuacion: 0,
    comentario: '',
    nombreUsuario: '',
    emailUsuario: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRatings()
    loadStats()
  }, [cocheId])

  const loadRatings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/valoraciones/${cocheId}`)
      const data = await response.json()
      setRatings(data)
    } catch (error) {
      console.error('Error loading ratings:', error)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/valoraciones/stats/${cocheId}`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
    setLoading(false)
  }

  const submitRating = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newRating.puntuacion === 0) {
      alert('Por favor selecciona una puntuación')
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/valoraciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newRating, cocheId })
      })

      if (response.ok) {
        setNewRating({ puntuacion: 0, comentario: '', nombreUsuario: '', emailUsuario: '' })
        setShowForm(false)
        loadRatings()
        loadStats()
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
    }
  }

  const StarRating = ({ rating, size = 'sm', interactive = false, onRate }: {
    rating: number
    size?: 'sm' | 'lg'
    interactive?: boolean
    onRate?: (rating: number) => void
  }) => {
    const starSize = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'
    
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`${starSize} ${
                star <= rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Valoraciones</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          Escribir Reseña
        </button>
      </div>

      {/* Estadísticas */}
      {stats && stats.total > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">
                {stats.promedio.toFixed(1)}
              </div>
              <StarRating rating={Math.round(stats.promedio)} size="lg" />
              <div className="text-sm text-gray-600 mt-1">
                {stats.total} reseña{stats.total !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = stats[`${stars === 1 ? 'una' : stars === 2 ? 'dos' : stars === 3 ? 'tres' : stars === 4 ? 'cuatro' : 'cinco'}_estrella${stars === 1 ? '' : 's'}`] || 0
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
                
                return (
                  <div key={stars} className="flex items-center gap-2 mb-1">
                    <span className="text-sm w-8">{stars}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Formulario de nueva reseña */}
      {showForm && (
        <motion.form
          onSubmit={submitRating}
          className="mb-6 p-4 border rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tu puntuación</label>
              <StarRating
                rating={newRating.puntuacion}
                size="lg"
                interactive
                onRate={(rating) => setNewRating(prev => ({ ...prev, puntuacion: rating }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tu nombre</label>
                <input
                  type="text"
                  value={newRating.nombreUsuario}
                  onChange={(e) => setNewRating(prev => ({ ...prev, nombreUsuario: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tu email</label>
                <input
                  type="email"
                  value={newRating.emailUsuario}
                  onChange={(e) => setNewRating(prev => ({ ...prev, emailUsuario: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Comentario (opcional)</label>
              <textarea
                value={newRating.comentario}
                onChange={(e) => setNewRating(prev => ({ ...prev, comentario: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
                placeholder="Comparte tu experiencia..."
              />
            </div>
            
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                Publicar Reseña
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </motion.form>
      )}

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {ratings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No hay reseñas aún</p>
            <p className="text-sm">¡Sé el primero en escribir una!</p>
          </div>
        ) : (
          ratings.map((rating) => (
            <div key={rating.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{rating.nombreUsuario}</span>
                    <StarRating rating={rating.puntuacion} />
                    <span className="text-sm text-gray-500">
                      {new Date(rating.fechaCreacion).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.comentario && (
                    <p className="text-gray-700">{rating.comentario}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}