'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Car, ArrowLeft, Phone, Mail, Calendar, Gauge, Fuel, Settings, ChevronLeft, ChevronRight, Edit } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import ImageViewer from '@/components/ImageViewer'

function CocheDetalleContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [coche, setCoche] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [viewerOpen, setViewerOpen] = useState(false)
  const { user } = useAuth()
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    if (id) {
      const cars = JSON.parse(localStorage.getItem('cars') || '[]')
      const foundCar = cars.find((car: any) => car.id === id)
      setCoche(foundCar)
      
      // Verificar si el usuario es el propietario o administrador
      if (foundCar && user) {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const fullUser = users.find((u: any) => u.email === user.email)
        const isUserOwner = foundCar.vendedor?.email === user.email
        const isAdmin = fullUser?.userType === 'administrador'
        setIsOwner(isUserOwner || isAdmin)
      }
    }
    setLoading(false)
  }, [id, user])

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div>Cargando...</div>
    </div>
  }

  if (!coche) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div>Coche no encontrado</div>
    </div>
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
            <Link href="/coches" className="flex items-center text-gray-600 hover:text-blue-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Coches
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            {(() => {
              const images = coche.imagenes && coche.imagenes.length > 0 
                ? coche.imagenes 
                : [coche.imagen || `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop`]
              
              return (
                <div className="relative">
                  <img
                    src={images[currentImage]}
                    alt={`${coche.marca} ${coche.modelo}`}
                    className="w-full h-96 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setViewerOpen(true)}
                  />
                  
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => setCurrentImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {images.map((_: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImage(index)}
                            className={`w-3 h-3 rounded-full ${
                              index === currentImage ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            })()} 
            
            {(() => {
              const images = coche.imagenes && coche.imagenes.length > 0 
                ? coche.imagenes 
                : [coche.imagen || `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop`]
              
              return images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`relative overflow-hidden rounded border-2 ${
                        index === currentImage ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Vista ${index + 1}`}
                        className="w-full h-20 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          setCurrentImage(index)
                          setViewerOpen(true)
                        }}
                      />
                    </button>
                  ))}
                </div>
              )
            })()} 
          </div>

          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {coche.marca} {coche.modelo}
              </h1>
              {isOwner && (
                <Link
                  href={`/admin/editar?id=${coche.id}`}
                  className="bg-blue-100 text-blue-800 px-3 py-2 rounded-md hover:bg-blue-200 flex items-center gap-2 text-sm"
                >
                  <Edit className="h-4 w-4" />
                  Editar Anuncio
                </Link>
              )}
            </div>
            <p className="text-4xl font-bold text-blue-600 mb-6">
              ${coche.precio?.toLocaleString()} MXN
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span>{coche.año}</span>
              </div>
              <div className="flex items-center">
                <Gauge className="h-5 w-5 text-gray-400 mr-2" />
                <span>{coche.kilometraje?.toLocaleString()} km</span>
              </div>
              <div className="flex items-center">
                <Fuel className="h-5 w-5 text-gray-400 mr-2" />
                <span>{coche.combustible}</span>
              </div>
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-gray-400 mr-2" />
                <span>{coche.transmision || 'Manual'}</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">{coche.descripcion}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Contactar Vendedor</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="font-medium">{coche.vendedor?.nombre || 'Vendedor V&R'}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <a href={`tel:${coche.vendedor?.telefono || '+52 55 1234 5678'}`} className="text-blue-600 hover:text-blue-700">
                    {coche.vendedor?.telefono || '+52 55 1234 5678'}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <a href={`mailto:${coche.vendedor?.email || 'info@vrautos.com'}`} className="text-blue-600 hover:text-blue-700">
                    {coche.vendedor?.email || 'info@vrautos.com'}
                  </a>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <a
                  href={`tel:${coche.vendedor?.telefono || '+52 55 1234 5678'}`}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-center block"
                >
                  Llamar Ahora
                </a>
                <a
                  href={`mailto:${coche.vendedor?.email || 'info@vrautos.com'}?subject=Interés en ${coche.marca} ${coche.modelo}`}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 text-center block"
                >
                  Enviar Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ImageViewer
        images={(() => {
          const images = coche.imagenes && coche.imagenes.length > 0 
            ? coche.imagenes 
            : [coche.imagen || `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=800&fit=crop`]
          return images
        })()}
        currentIndex={currentImage}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </div>
  )
}

export default function CocheDetallePage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CocheDetalleContent />
    </Suspense>
  )
}