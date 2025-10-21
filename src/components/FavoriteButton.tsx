'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { favoritesManager } from '@/lib/favorites'

interface FavoriteButtonProps {
  cocheId: string
  className?: string
}

export default function FavoriteButton({ cocheId, className = '' }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Verificar usuario y favoritos
    const userData = localStorage.getItem('user')
    setUser(userData ? JSON.parse(userData) : null)
    setIsFavorite(favoritesManager.isFavorite(cocheId))

    const handleFavoritesChange = (event: CustomEvent) => {
      if (event.detail.cocheId === cocheId) {
        setIsFavorite(event.detail.action === 'add')
      }
    }

    window.addEventListener('favoritesChanged', handleFavoritesChange as EventListener)
    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChange as EventListener)
    }
  }, [cocheId])

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      alert('Debes iniciar sesión para agregar favoritos')
      return
    }
    
    const newState = favoritesManager.toggleFavorite(cocheId)
    setIsFavorite(newState)
  }

  return (
    <motion.button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all duration-200 ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={{ 
          scale: isFavorite ? [1, 1.3, 1] : 1,
          rotate: isFavorite ? [0, 15, -15, 0] : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <Heart 
          className={`h-5 w-5 transition-colors ${
            isFavorite 
              ? 'text-red-500 fill-red-500' 
              : 'text-gray-400 hover:text-red-400'
          }`}
        />
      </motion.div>
    </motion.button>
  )
}