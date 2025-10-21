'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Image, Plus, Trash2, Eye, EyeOff } from 'lucide-react'

export default function SlideshowPage() {
  const [cars, setCars] = useState<any[]>([])
  const [slideshowItems, setSlideshowItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    try {
      const carsData = JSON.parse(localStorage.getItem('cars') || '[]')
      const slideshowData = JSON.parse(localStorage.getItem('slideshow') || '[]')
      
      setCars(carsData)
      setSlideshowItems(slideshowData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToSlideshow = (carId: string, customImage?: string) => {
    const car = cars.find(c => c.id === carId)
    if (!car) return

    const newSlideshowItem = {
      id: Date.now().toString(),
      carId: carId,
      title: `${car.marca} ${car.modelo} ${car.año}`,
      image: customImage || car.imagen || car.imagenes?.[0],
      price: car.precio,
      active: true,
      createdAt: new Date().toISOString()
    }

    const updatedSlideshow = [...slideshowItems, newSlideshowItem]
    setSlideshowItems(updatedSlideshow)
    localStorage.setItem('slideshow', JSON.stringify(updatedSlideshow))
  }

  const updateSlideshowImage = (itemId: string, newImage: string) => {
    const updatedSlideshow = slideshowItems.map(item => 
      item.id === itemId ? { ...item, image: newImage } : item
    )
    setSlideshowItems(updatedSlideshow)
    localStorage.setItem('slideshow', JSON.stringify(updatedSlideshow))
  }

  const removeFromSlideshow = (itemId: string) => {
    const updatedSlideshow = slideshowItems.filter(item => item.id !== itemId)
    setSlideshowItems(updatedSlideshow)
    localStorage.setItem('slideshow', JSON.stringify(updatedSlideshow))
  }

  const toggleSlideshow = (itemId: string) => {
    const updatedSlideshow = slideshowItems.map(item => 
      item.id === itemId ? { ...item, active: !item.active } : item
    )
    setSlideshowItems(updatedSlideshow)
    localStorage.setItem('slideshow', JSON.stringify(updatedSlideshow))
  }

  const availableCars = cars.filter(car => 
    !slideshowItems.some(item => item.carId === car.id)
  )

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
              <span className="ml-2 text-xl font-bold text-gray-900">Gestión de Slideshow</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Slideshow</h1>
          <p className="text-gray-600">Administra las imágenes que aparecen en el slideshow principal</p>
          
          {/* Instrucciones */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">📷 Especificaciones de Imágenes para Slideshow</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Tamaño recomendado:</strong> 1200x600 píxeles (proporción 2:1)</li>
              <li>• <strong>Formato:</strong> JPG, PNG o WebP</li>
              <li>• <strong>Peso máximo:</strong> 2MB para carga rápida</li>
              <li>• <strong>Calidad:</strong> Alta resolución para mejor visualización</li>
            </ul>
          </div>
        </div>

        {/* Slideshow Actual */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Slideshow Actual ({slideshowItems.length} elementos)</h2>
          {slideshowItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay elementos en el slideshow</h3>
              <p className="text-gray-600">Agrega coches desde la lista de abajo</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {slideshowItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-primary-600 font-bold text-xl mt-2">
                      ${item.price?.toLocaleString()} MXN
                    </p>
                    
                    {/* Cambiar imagen */}
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Cambiar imagen del slideshow:
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              updateSlideshowImage(item.id, event.target?.result as string)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                      />
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => toggleSlideshow(item.id)}
                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                          item.active 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {item.active ? <Eye className="h-4 w-4 inline mr-1" /> : <EyeOff className="h-4 w-4 inline mr-1" />}
                        {item.active ? 'Activo' : 'Inactivo'}
                      </button>
                      <button
                        onClick={() => removeFromSlideshow(item.id)}
                        className="p-2 bg-red-100 text-red-800 hover:bg-red-200 rounded-md"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coches Disponibles */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Coches Disponibles para Slideshow ({availableCars.length})</h2>
          {availableCars.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Todos los coches están en el slideshow</h3>
              <p className="text-gray-600">No hay más coches disponibles para agregar</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {availableCars.map((car) => (
                <div key={car.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                    {car.imagen || car.imagenes?.[0] ? (
                      <img
                        src={car.imagen || car.imagenes?.[0]}
                        alt={`${car.marca} ${car.modelo}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="h-12 w-12 text-gray-400" />
                    )}
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
                    
                    {/* Opción de imagen personalizada */}
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Imagen personalizada (opcional):
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        id={`custom-image-${car.id}`}
                        className="w-full text-xs border border-gray-300 rounded px-2 py-1 mb-2"
                      />
                    </div>
                    
                    <button
                      onClick={() => {
                        const fileInput = document.getElementById(`custom-image-${car.id}`) as HTMLInputElement
                        const file = fileInput?.files?.[0]
                        
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (event) => {
                            addToSlideshow(car.id, event.target?.result as string)
                          }
                          reader.readAsDataURL(file)
                        } else {
                          addToSlideshow(car.id)
                        }
                      }}
                      className="w-full mt-2 btn-primary flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar al Slideshow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}