'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Wand2, Upload, Loader2, X } from 'lucide-react'
import Image from 'next/image'

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
  })
  
  const [generandoDescripcion, setGenerandoDescripcion] = useState(false)
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [imagenes, setImagenes] = useState<string[]>([])
  
  const { data: session } = useSession()
  const router = useRouter()

  const generarDescripcion = async () => {
    if (!formData.marca || !formData.modelo) return
    
    setGenerandoDescripcion(true)
    try {
      const response = await fetch('/api/ai/descripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      setFormData(prev => ({ ...prev, descripcion: data.descripcion }))
    } catch (error) {
      console.error('Error:', error)
    }
    setGenerandoDescripcion(false)
  }

  const subirImagen = async (file: File) => {
    setSubiendoImagen(true)
    try {
      const formDataImg = new FormData()
      formDataImg.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataImg,
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setImagenes(prev => [...prev, data.url])
        alert('Imagen subida correctamente')
      } else {
        alert(data.error || 'Error subiendo imagen')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error subiendo imagen')
    }
    setSubiendoImagen(false)
  }

  const eliminarImagen = (index: number) => {
    setImagenes(prev => prev.filter((_, i) => i !== index))
  }

  const guardarCoche = async () => {
    if (!session?.user?.email) {
      alert('Debes estar autenticado')
      return
    }

    setGuardando(true)
    try {
      // Obtener vendedor por email
      const vendedorResponse = await fetch(`/api/vendedores?email=${session.user.email}`)
      const vendedores = await vendedorResponse.json()
      const vendedor = vendedores[0]

      if (!vendedor) {
        alert('Vendedor no encontrado')
        return
      }

      const response = await fetch('/api/coches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          precio: parseFloat(formData.precio),
          kilometraje: parseInt(formData.kilometraje),
          imagenes,
          vendedorId: vendedor.id,
        }),
      })

      if (response.ok) {
        alert('Coche publicado correctamente')
        router.push('/admin')
      } else {
        const error = await response.json()
        alert(error.error || 'Error al guardar')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar')
    }
    setGuardando(false)
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
          <label className="block text-sm font-medium mb-2">Precio (€)</label>
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
        <label className="block text-sm font-medium mb-2">Imagen del Coche</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) subirImagen(file)
            }}
            className="hidden"
            id="imagen-upload"
          />
          <label htmlFor="imagen-upload" className="cursor-pointer">
            {subiendoImagen ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subiendo imagen...
              </div>
            ) : (
              <span className="text-primary-600 hover:text-primary-700">
                Subir imagen (se analizará automáticamente)
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
              <div key={index} className="relative">
                <Image
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  width={200}
                  height={150}
                  className="rounded-lg object-cover"
                />
                <button
                  onClick={() => eliminarImagen(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
    </div>
  )
}