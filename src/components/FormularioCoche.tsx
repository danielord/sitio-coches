'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Wand2, Upload, Loader2, X, Edit } from 'lucide-react'
import { api } from '@/lib/api'
import { authClient } from '@/lib/auth-client'
import { useAuthRequired } from '@/hooks/useAuthRequired'
import ImageEditor from './ImageEditor'

export default function FormularioCoche() {
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
  
  const [generandoDescripcion, setGenerandoDescripcion] = useState(false)
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [imagenes, setImagenes] = useState<string[]>([])
  const [editingImage, setEditingImage] = useState<File | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  
  const { user, loading } = useAuthRequired()
  const router = useRouter()

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Verificando sesión...</p>
        </div>
      </div>
    )
  }

  const generarDescripcion = async () => {
    if (!formData.marca || !formData.modelo) return
    
    setGenerandoDescripcion(true)
    
    // Simular generación de descripción
    setTimeout(() => {
      const descripcion = `Excelente ${formData.marca} ${formData.modelo} en perfectas condiciones. Ideal para uso diario con bajo consumo y gran confiabilidad.`
      setFormData(prev => ({ ...prev, descripcion }))
      setGenerandoDescripcion(false)
    }, 2000)
  }

  const procesarImagen = (file: File) => {
    console.log('Procesando imagen:', file.name, 'Tamaño:', file.size)
    
    if (imagenes.length >= 5) {
      alert('Máximo 5 imágenes permitidas')
      return
    }
    
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert('Imagen muy grande. Máximo 10MB.')
      return
    }
    
    const img = new window.Image()
    img.onload = () => {
      console.log('Dimensiones imagen:', img.width, 'x', img.height)
      // Siempre abrir editor para optimizar
      console.log('Abriendo editor para todas las imágenes...')
      setEditingImage(file)
      setShowEditor(true)
    }
    img.onerror = () => {
      console.error('Error cargando imagen')
      alert('Error al cargar la imagen')
    }
    img.src = URL.createObjectURL(file)
  }

  const subirImagenDirecta = (file: File) => {
    setSubiendoImagen(true)
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new window.Image()
    
    img.onload = () => {
      const maxWidth = 800
      const maxHeight = 600
      let { width, height } = img
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }
      
      canvas.width = width
      canvas.height = height
      ctx?.drawImage(img, 0, 0, width, height)
      
      const compressedImage = canvas.toDataURL('image/jpeg', 0.8)
      setImagenes(prev => [...prev, compressedImage])
      setSubiendoImagen(false)
    }
    
    img.src = URL.createObjectURL(file)
  }

  const handleEditorSave = (editedImage: string) => {
    setImagenes(prev => [...prev, editedImage])
    setShowEditor(false)
    setEditingImage(null)
  }

  const handleEditorCancel = () => {
    setShowEditor(false)
    setEditingImage(null)
  }

  const eliminarImagen = (index: number) => {
    setImagenes(prev => prev.filter((_, i) => i !== index))
  }

  const guardarCoche = async () => {
    setGuardando(true)
    
    try {
      const nuevoCoche = {
        ...formData,
        precio: parseFloat(formData.precio) || 0,
        kilometraje: parseInt(formData.kilometraje) || 0,
        imagen: imagenes.length > 0 ? imagenes[0] : `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop&auto=format&q=80`,
        imagenes: imagenes.length > 0 ? imagenes : [],
        vendedor: {
          nombre: user.name || user.firstName || 'Vendedor V&R',
          telefono: '+52 55 1234 5678',
          email: user.email || 'info@vrautos.com'
        }
      }
      
      await api.createCoche(nuevoCoche)
      alert('Coche publicado correctamente')
      router.push('/coches')
    } catch (error) {
      console.error('Error guardando coche:', error)
      alert('Error al publicar el coche. Intenta de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Publicar Nuevo Coche</h2>
      
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Marca</label>
          <input
            type="text"
            value={formData.marca}
            onChange={(e) => setFormData(prev => ({ ...prev, marca: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Toyota, Ford, etc."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Modelo</label>
          <input
            type="text"
            value={formData.modelo}
            onChange={(e) => setFormData(prev => ({ ...prev, modelo: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Corolla, Focus, etc."
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

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Descripción</label>
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={generarDescripcion}
            disabled={generandoDescripcion || !formData.marca || !formData.modelo}
            className="btn-primary flex items-center"
          >
            {generandoDescripcion ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-2" />
            )}
            Generar con IA
          </button>
        </div>
        <textarea
          value={formData.descripcion}
          onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
          className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
          placeholder="Descripción del vehículo..."
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Imágenes del Coche (máximo 5)</label>
        <div className="text-xs text-gray-600 mb-2">
          📝 Todas las imágenes se abrirán en el editor para optimizar
        </div>
        <button
          type="button"
          onClick={() => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0]
              if (file) {
                setEditingImage(file)
                setShowEditor(true)
              }
            }
            input.click()
          }}
          className="mb-2 px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
        >
          🎨 Abrir Editor Manual
        </button>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              files.forEach(file => procesarImagen(file))
            }}
            className="hidden"
            id="imagen-upload"
            disabled={imagenes.length >= 5}
          />
          <label htmlFor="imagen-upload" className={`cursor-pointer ${imagenes.length >= 5 ? 'opacity-50' : ''}`}>
            {subiendoImagen ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subiendo imagen...
              </div>
            ) : (
              <span className="text-primary-600 hover:text-primary-700">
                {imagenes.length >= 5 ? 'Máximo 5 imágenes' : `Subir imágenes (${imagenes.length}/5)`}
              </span>
            )}
          </label>
        </div>
      </div>

      {imagenes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Imágenes subidas:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {imagenes.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-32 rounded-lg object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => {
                      // Convertir base64 a File para editar
                      fetch(url)
                        .then(res => res.blob())
                        .then(blob => {
                          const file = new File([blob], `imagen-${index}.jpg`, { type: 'image/jpeg' })
                          setEditingImage(file)
                          setShowEditor(true)
                          // Eliminar la imagen actual para reemplazarla
                          eliminarImagen(index)
                        })
                    }}
                    className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => eliminarImagen(index)}
                    className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.enSlideshow}
            onChange={(e) => setFormData(prev => ({ ...prev, enSlideshow: e.target.checked }))}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
          />
          <span className="text-sm text-gray-700">Incluir en slideshow de la página principal</span>
        </label>
      </div>

      <button 
        onClick={guardarCoche}
        disabled={guardando || !formData.marca || !formData.modelo}
        className="w-full btn-primary"
      >
        {guardando ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Guardando...
          </div>
        ) : (
          'Publicar Coche'
        )}
      </button>
      
      {/* Editor de Imágenes */}
      {showEditor && editingImage && (
        <ImageEditor
          imageFile={editingImage}
          onSave={handleEditorSave}
          onCancel={handleEditorCancel}
        />
      )}
    </div>
  )
}