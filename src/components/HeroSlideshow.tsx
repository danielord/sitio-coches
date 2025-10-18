'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import Link from 'next/link'

const featuredCars = [
  {
    id: 1,
    marca: 'BMW',
    modelo: 'Serie 3',
    año: 2023,
    precio: 45000,
    imagen: 'https://picsum.photos/1200/600?random=1',
    descripcion: 'Elegancia y deportividad en perfecta armonía'
  },
  {
    id: 2,
    marca: 'Mercedes',
    modelo: 'Clase C',
    año: 2023,
    precio: 52000,
    imagen: 'https://picsum.photos/1200/600?random=2',
    descripcion: 'Lujo y tecnología de vanguardia'
  },
  {
    id: 3,
    marca: 'Audi',
    modelo: 'A4',
    año: 2023,
    precio: 48000,
    imagen: 'https://picsum.photos/1200/600?random=3',
    descripcion: 'Innovación alemana en cada detalle'
  }
]

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredCars.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredCars.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredCars.length) % featuredCars.length)
  }

  return (
    <div className="relative h-[70vh] overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Fondo animado */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
              'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))',
              'linear-gradient(225deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 flex items-center"
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
            {/* Contenido */}
            <motion.div
              className="text-white z-10"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.h1
                className="text-5xl lg:text-7xl font-bold mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {featuredCars[currentSlide].marca}
                <span className="block text-3xl lg:text-4xl text-blue-300">
                  {featuredCars[currentSlide].modelo}
                </span>
              </motion.h1>
              
              <motion.p
                className="text-xl mb-6 text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                {featuredCars[currentSlide].descripcion}
              </motion.p>
              
              <motion.div
                className="flex items-center gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <span className="text-3xl font-bold text-yellow-400">
                  €{featuredCars[currentSlide].precio.toLocaleString()}
                </span>
                <span className="text-gray-400">• {featuredCars[currentSlide].año}</span>
              </motion.div>
              
              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <Link
                  href="/coches"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Ver Detalles
                </Link>
                <Link
                  href="/coches"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300"
                >
                  Explorar Más
                </Link>
              </motion.div>
            </motion.div>

            {/* Imagen */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={featuredCars[currentSlide].imagen}
                  alt={`${featuredCars[currentSlide].marca} ${featuredCars[currentSlide].modelo}`}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controles */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        {/* Indicadores */}
        <div className="flex gap-2">
          {featuredCars.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Botones */}
        <div className="flex gap-2 ml-4">
          <button
            onClick={prevSlide}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300"
          >
            <Play className={`w-5 h-5 text-white ${isAutoPlaying ? 'opacity-50' : ''}`} />
          </button>
          
          <button
            onClick={nextSlide}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}