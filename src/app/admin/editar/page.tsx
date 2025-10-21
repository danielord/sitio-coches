'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Edit } from 'lucide-react'
import ImageEditor from '@/components/ImageEditor'
import AIDescriptionGenerator from '@/components/AIDescriptionGenerator'
import AIImageGenerator from '@/components/AIImageGenerator'

function EditarCocheContent() {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    año: new Date().getFullYear(),
    precio: '',
    kilometraje: '',
    combustible: 'Gasolina',
    transmision: 'Manual',
    color: '',
    descripcion: '',
    enSlideshow: false,
  })
  
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [imagenes, setImagenes] = useState<string[]>([])
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const [editingImage, setEditingImage] = useState<File | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const cocheId = searchParams.get('id')

  useEffect(() => {
    if (cocheId) {
      const cars = JSON.parse(localStorage.getItem('cars') || '[]')
      const coche = cars.find((car: any) => car.id === cocheId)
      
      if (coche) {
        setFormData({
          marca: coche.marca || '',
          modelo: coche.modelo || '',
          año: coche.año || new Date().getFullYear(),
          precio: coche.precio?.toString() || '',
          kilometraje: coche.kilometraje?.toString() || '',
          combustible: coche.combustible || 'Gasolina',
          transmision: coche.transmision || 'Manual',
          color: coche.color || '',
          descripcion: coche.descripcion || '',
          enSlideshow: coche.enSlideshow || false,
        })
        setImagenes(coche.imagenes || [coche.imagen].filter(Boolean))
      }
    }
    setLoading(false)
  }, [cocheId])

  const handleEditorSave = (editedImage: string) => {
    setImagenes(prev => [...prev, editedImage])
    setShowEditor(false)
    setEditingImage(null)
  }

  const handleEditorCancel = () => {
    setShowEditor(false)
    setEditingImage(null)
  }

  const abrirEditor = (file?: File) => {
    if (file) {
      setEditingImage(file)
      setShowEditor(true)
    } else {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => {
        const selectedFile = (e.target as HTMLInputElement).files?.[0]
        if (selectedFile) {
          setEditingImage(selectedFile)
          setShowEditor(true)
        }
      }
      input.click()
    }
  }

  const guardarCambios = () => {
    setGuardando(true)
    
    const cars = JSON.parse(localStorage.getItem('cars') || '[]')
    const updatedCars = cars.map((car: any) => {
      if (car.id === cocheId) {
        return {
          ...car,
          ...formData,
          precio: parseFloat(formData.precio) || 0,
          kilometraje: parseInt(formData.kilometraje) || 0,
          imagen: imagenes[0] || car.imagen,
          imagenes: imagenes,
        }
      }
      return car
    })
    
    try {
      localStorage.setItem('cars', JSON.stringify(updatedCars))
    } catch (error) {
      if (error instanceof DOMException && error.code === 22) {
        // Cuota excedida - limpiar y reintentar
        // Limpiar localStorage completamente y mantener solo este coche
        const updatedCar = {
          id: cocheId,
          ...formData,
          precio: parseFloat(formData.precio) || 0,
          kilometraje: parseInt(formData.kilometraje) || 0,
          imagen: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop',
          imagenes: [],
          vendedor: { nombre: 'V&R Autos', email: 'info@vrautos.com', telefono: '+52 55 1234 5678' }
        }
        localStorage.clear()
        localStorage.setItem('cars', JSON.stringify([updatedCar]))
        alert('Almacenamiento lleno. Se limpiaron datos antiguos y se guardó con menos imágenes.')
      } else {
        throw error
      }
    }
    
    setTimeout(() => {
      alert('Coche actualizado correctamente')
      router.push('/admin/mis-coches')
      setGuardando(false)
    }, 500)
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <img src="/logo.jpg" alt="V&R Autos" className="h-10 w-10 rounded-full" />
              <span className="ml-2 text-xl font-bold text-gray-900">V&R Autos</span>
            </Link>
            <Link href="/admin/mis-coches" className="text-blue-600 hover:text-blue-500">
              Volver a Mis Coches
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Editar Coche</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Marca</label>
              <input
                type="text"
                value={formData.marca}
                onChange={(e) => setFormData(prev => ({ ...prev, marca: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Modelo</label>
              <input
                type="text"
                value={formData.modelo}
                onChange={(e) => setFormData(prev => ({ ...prev, modelo: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Año</label>
              <input
                type="number"
                value={formData.año}
                onChange={(e) => setFormData(prev => ({ ...prev, año: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Precio (MXN)</label>
              <input
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData(prev => ({ ...prev, precio: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Kilometraje</label>
              <input
                type="number"
                value={formData.kilometraje}
                onChange={(e) => setFormData(prev => ({ ...prev, kilometraje: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Combustible</label>
              <select
                value={formData.combustible}
                onChange={(e) => setFormData(prev => ({ ...prev, combustible: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="Gasolina">Gasolina</option>
                <option value="Diésel">Diésel</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Eléctrico">Eléctrico</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Transmisión</label>
              <select
                value={formData.transmision}
                onChange={(e) => setFormData(prev => ({ ...prev, transmision: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="Manual">Manual</option>
                <option value="Automática">Automática</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Color</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Descripción</label>
            
            <div className="mb-4">
              <AIDescriptionGenerator 
                carData={{
                  marca: formData.marca,
                  modelo: formData.modelo,
                  año: formData.año.toString(),
                  precio: formData.precio,
                  kilometraje: formData.kilometraje,
                  combustible: formData.combustible,
                  transmision: formData.transmision,
                  color: formData.color,
                  estado: 'Excelente', // Valor por defecto para edición
                  negociable: true,
                  caracteristicasPersonalizadas: []
                }}
                onGenerate={(description) => setFormData(prev => ({ ...prev, descripcion: description }))}
              />
            </div>
            
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
              placeholder="Escribe la descripción o usa el generador de IA de arriba..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Imágenes (máximo 5)</label>
            
            <div className="mb-6">
              <AIImageGenerator 
                carData={{
                  marca: formData.marca,
                  modelo: formData.modelo,
                  año: formData.año.toString(),
                  color: formData.color
                }}
                onSelectImages={(images) => setImagenes(prev => [...prev, ...images].slice(0, 5))}
              />
            </div>
            
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => abrirEditor()}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Editor de Imágenes
              </button>
              <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    files.forEach(file => {
                      if (imagenes.length < 5) {
                        abrirEditor(file)
                      }
                    })
                  }}
                  className="hidden"
                  id="imagen-upload"
                  disabled={imagenes.length >= 5}
                />
                <label htmlFor="imagen-upload" className={`cursor-pointer ${imagenes.length >= 5 ? 'opacity-50' : ''}`}>
                  {subiendoImagen ? 'Subiendo...' : `Seleccionar imágenes (${imagenes.length}/5)`}
                </label>
              </div>
            </div>
            
            {imagenes.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imagenes.map((url, index) => (
                  <div key={index} className="relative group">
                    <img src={url} alt={`Imagen ${index + 1}`} className="w-full h-24 object-cover rounded" />
                    <div className="absolute top-1 right-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          fetch(url)
                            .then(res => res.blob())
                            .then(blob => {
                              const file = new File([blob], `imagen-${index}.jpg`, { type: 'image/jpeg' })
                              setImagenes(prev => prev.filter((_, i) => i !== index))
                              abrirEditor(file)
                            })
                        }}
                        className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setImagenes(prev => prev.filter((_, i) => i !== index))}
                        className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.enSlideshow}
                onChange={(e) => setFormData(prev => ({ ...prev, enSlideshow: e.target.checked }))}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
              />
              <span className="text-sm text-gray-700">Incluir en slideshow</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={guardarCambios}
              disabled={guardando}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            
            <Link 
              href="/admin/mis-coches"
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 text-center"
            >
              Cancelar
            </Link>
          </div>
        </div>
        
        {/* Editor de Imágenes */}
        {showEditor && editingImage && (
          <ImageEditor
            imageFile={editingImage}
            onSave={handleEditorSave}
            onCancel={handleEditorCancel}
          />
        )}
      </div>
    </div>
  )
}

export default function EditarCochePage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <EditarCocheContent />
    </Suspense>
  )
}