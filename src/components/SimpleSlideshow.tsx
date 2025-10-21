'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const defaultSlides = [
  {
    id: 'default-1',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=600&fit=crop',
    title: 'Encuentra tu Coche Ideal',
    subtitle: 'Miles de coches verificados esperándote'
  },
  {
    id: 'default-2',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=600&fit=crop',
    title: 'Vende tu Coche Fácilmente',
    subtitle: 'Publica tu anuncio en minutos'
  },
  {
    id: 'default-3',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=600&fit=crop',
    title: 'Precios Competitivos',
    subtitle: 'Las mejores ofertas del mercado'
  }
]

export default function SimpleSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState(defaultSlides)
  const router = useRouter()

  useEffect(() => {
    // Cargar coches marcados para slideshow
    try {
      const cars = JSON.parse(localStorage.getItem('cars') || '[]')
      const slideshowCars = cars.filter((car: any) => car.enSlideshow)
      
      if (slideshowCars.length > 0) {
        const slideshowSlides = slideshowCars.map((car: any) => ({
          id: car.id,
          image: car.imagen || car.imagenes?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=600&fit=crop',
          title: `${car.marca} ${car.modelo} ${car.año}`,
          subtitle: `$${car.precio?.toLocaleString()} MXN - ${car.kilometraje?.toLocaleString()} km`
        }))
        setSlides([...defaultSlides, ...slideshowSlides])
      } else {
        setSlides(defaultSlides)
      }
    } catch (error) {
      console.error('localStorage corrupto, limpiando...')
      localStorage.removeItem('cars')
      setSlides(defaultSlides)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleSlideClick = (slide: any) => {
    if (slide.id.startsWith('default-')) return
    router.push(`/coche?id=${slide.id}`)
  }

  return (
    <div className="relative h-96 overflow-hidden rounded-lg">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          } ${!slide.id.startsWith('default-') ? 'cursor-pointer' : ''}`}
          onClick={() => handleSlideClick(slide)}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl">{slide.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
      
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}