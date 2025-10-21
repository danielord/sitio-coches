'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PublicationWizard from '@/components/PublicationWizard'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CarStorage } from '@/lib/storage'

export default function NuevoCochePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleWizardComplete = async (wizardData: any) => {
    setLoading(true)
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      // Usar imágenes subidas o imagen por defecto
      const defaultImage = `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&q=80`
      const imagenes = wizardData.imagenes && wizardData.imagenes.length > 0 
        ? wizardData.imagenes 
        : [defaultImage]
      
      const newCar = {
        id: `car-${Date.now()}`,
        marca: wizardData.marca,
        modelo: wizardData.modelo,
        año: parseInt(wizardData.año),
        precio: parseFloat(wizardData.precio),
        kilometraje: parseInt(wizardData.kilometraje),
        combustible: wizardData.combustible,
        transmision: wizardData.transmision,
        color: wizardData.color,
        descripcion: wizardData.descripcion,
        imagen: imagenes[0],
        imagenes: imagenes,
        vendedor: {
          nombre: user.firstName || user.name || 'V&R Autos',
          telefono: user.phone || '+52 55 1234 5678',
          email: user.email || 'contacto@vrautos.com'
        },
        estado: wizardData.estado,
        negociable: wizardData.negociable,
        equipamiento: {
          aireAcondicionado: wizardData.aireAcondicionado,
          direccionHidraulica: wizardData.direccionHidraulica,
          vidriosElectricos: wizardData.vidriosElectricos,
          segurosElectricos: wizardData.segurosElectricos,
          stereo: wizardData.stereo,
          alarma: wizardData.alarma
        },
        caracteristicasPersonalizadas: wizardData.caracteristicasPersonalizadas || [],
        puertas: wizardData.puertas,
        disponible: true,
        enSlideshow: wizardData.enSlideshow || false,
        fechaCreacion: new Date().toISOString()
      }
      
      const cars = JSON.parse(localStorage.getItem('cars') || '[]')
      cars.push(newCar)
      localStorage.setItem('cars', JSON.stringify(cars))
      
      alert('¡Vehículo publicado exitosamente!')
      router.push('/admin')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al publicar el vehículo')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Publicando vehículo...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="flex items-center">
                <img src="/logo.jpg" alt="V&R Autos" className="h-10 w-10 rounded-full" />
                <span className="ml-2 text-xl font-bold text-gray-900">V&R Autos - Asistente de Publicación</span>
              </Link>
              <Link href="/admin" className="btn-secondary flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Admin
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Publicar Nuevo Vehículo</h1>
            <p className="text-gray-600">Te guiaremos paso a paso para crear un anuncio profesional</p>
          </div>
          
          <PublicationWizard onComplete={handleWizardComplete} />
        </div>
      </div>
    </ProtectedRoute>
  )
}