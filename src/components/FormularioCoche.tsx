'use client'

import { useState } from 'react'
import { Wand2, Upload, Loader2 } from 'lucide-react'

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
  const [analizandoImagen, setAnalizandoImagen] = useState(false)

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

  const analizarImagen = async (file: File) => {
    setAnalizandoImagen(true)
    try {
      const formDataImg = new FormData()
      formDataImg.append('imagen', file)
      
      const response = await fetch('/api/ai/imagen', {
        method: 'POST',
        body: formDataImg,
      })
      
      const data = await response.json()
      
      if (!data.esCoche) {
        alert('La imagen no parece ser de un coche')
      } else if (data.contenidoInapropiado) {
        alert('La imagen contiene contenido inapropiado')
      } else {
        alert('Imagen válida - Etiquetas detectadas: ' + data.etiquetas.map((e: any) => e.nombre).join(', '))
      }
    } catch (error) {
      console.error('Error:', error)
    }
    setAnalizandoImagen(false)
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
              if (file) analizarImagen(file)
            }}
            className="hidden"
            id="imagen-upload"
          />
          <label htmlFor="imagen-upload" className="cursor-pointer">
            {analizandoImagen ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analizando imagen...
              </div>
            ) : (
              <span className="text-primary-600 hover:text-primary-700">
                Subir imagen (se analizará automáticamente)
              </span>
            )}
          </label>
        </div>
      </div>

      <button className="w-full btn-primary">
        Publicar Coche
      </button>
    </div>
  )
}