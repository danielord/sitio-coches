'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, Check, Car } from 'lucide-react'
import AIDescriptionGenerator from './AIDescriptionGenerator'
import AIImageGenerator from './AIImageGenerator'

interface WizardData {
  // Paso 1: Información Básica
  marca: string
  modelo: string
  año: string
  
  // Paso 2: Características
  combustible: string
  transmision: string
  color: string
  puertas: string
  
  // Paso 3: Estado y Precio
  kilometraje: string
  precio: string
  estado: string
  negociable: boolean
  
  // Paso 4: Equipamiento
  aireAcondicionado: boolean
  direccionHidraulica: boolean
  vidriosElectricos: boolean
  segurosElectricos: boolean
  stereo: boolean
  alarma: boolean
  caracteristicasPersonalizadas: string[]
  
  // Paso 5: Imágenes
  imagenes: string[]
  
  // Paso 6: Descripción y Opciones
  descripcion: string
  enSlideshow: boolean
}

const MARCAS = [
  'Nissan', 'Toyota', 'Honda', 'Mazda', 'Hyundai', 'Kia', 'Chevrolet', 
  'Ford', 'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi', 'Otro'
]

const COMBUSTIBLES = ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico', 'GLP']
const TRANSMISIONES = ['Manual', 'Automática', 'CVT']
const COLORES = ['Blanco', 'Negro', 'Gris', 'Plata', 'Rojo', 'Azul', 'Verde', 'Amarillo', 'Otro']
const PUERTAS = ['2', '3', '4', '5']
const ESTADOS = ['Excelente', 'Muy Bueno', 'Bueno', 'Regular']

export default function PublicationWizard({ onComplete }: { onComplete: (data: WizardData) => void }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<WizardData>({
    marca: '', modelo: '', año: '',
    combustible: '', transmision: '', color: '', puertas: '',
    kilometraje: '', precio: '', estado: '', negociable: false,
    aireAcondicionado: false, direccionHidraulica: false, vidriosElectricos: false,
    segurosElectricos: false, stereo: false, alarma: false,
    caracteristicasPersonalizadas: [],
    imagenes: [],
    descripcion: '',
    enSlideshow: false
  })

  const updateData = (field: keyof WizardData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.marca && data.modelo && data.año
      case 2: return data.combustible && data.transmision && data.color && data.puertas
      case 3: return data.kilometraje && data.precio && data.estado
      case 4: return true // Equipamiento es opcional
      case 5: return true // Imágenes son opcionales
      case 6: return data.descripcion.length >= 20
      default: return false
    }
  }

  const nextStep = () => {
    if (canProceed() && currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    if (canProceed()) {
      onComplete(data)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step < currentStep ? 'bg-green-500 text-white' :
                step === currentStep ? 'bg-blue-500 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {step < currentStep ? <Check className="w-4 h-4" /> : step}
              </div>
              {step < 6 && <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Car className="w-6 h-6 mr-2" />
              Información Básica del Vehículo
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Marca *</label>
                <select 
                  value={data.marca} 
                  onChange={(e) => updateData('marca', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona una marca</option>
                  {MARCAS.map(marca => (
                    <option key={marca} value={marca}>{marca}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Modelo *</label>
                <input
                  type="text"
                  value={data.modelo}
                  onChange={(e) => updateData('modelo', e.target.value)}
                  placeholder="Ej: Sentra, Corolla, Civic..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Año *</label>
                <select 
                  value={data.año} 
                  onChange={(e) => updateData('año', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona el año</option>
                  {Array.from({ length: 25 }, (_, i) => 2024 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Características del Vehículo</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Combustible *</label>
                <select 
                  value={data.combustible} 
                  onChange={(e) => updateData('combustible', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona</option>
                  {COMBUSTIBLES.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Transmisión *</label>
                <select 
                  value={data.transmision} 
                  onChange={(e) => updateData('transmision', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona</option>
                  {TRANSMISIONES.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color *</label>
                <select 
                  value={data.color} 
                  onChange={(e) => updateData('color', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona</option>
                  {COLORES.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Puertas *</label>
                <select 
                  value={data.puertas} 
                  onChange={(e) => updateData('puertas', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona</option>
                  {PUERTAS.map(num => (
                    <option key={num} value={num}>{num} puertas</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Estado y Precio</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Kilometraje *</label>
                <input
                  type="number"
                  value={data.kilometraje}
                  onChange={(e) => updateData('kilometraje', e.target.value)}
                  placeholder="Ej: 50000"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Precio (MXN) *</label>
                <input
                  type="number"
                  value={data.precio}
                  onChange={(e) => updateData('precio', e.target.value)}
                  placeholder="Ej: 250000"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estado del vehículo *</label>
                <select 
                  value={data.estado} 
                  onChange={(e) => updateData('estado', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona el estado</option>
                  {ESTADOS.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.negociable}
                  onChange={(e) => updateData('negociable', e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm">Precio negociable</label>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Equipamiento</h2>
            <p className="text-gray-600 mb-4">Selecciona el equipamiento que incluye tu vehículo:</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { key: 'aireAcondicionado', label: 'Aire Acondicionado' },
                { key: 'direccionHidraulica', label: 'Dirección Hidráulica' },
                { key: 'vidriosElectricos', label: 'Vidrios Eléctricos' },
                { key: 'segurosElectricos', label: 'Seguros Eléctricos' },
                { key: 'stereo', label: 'Stereo/Radio' },
                { key: 'alarma', label: 'Alarma' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={data[key as keyof WizardData] as boolean}
                    onChange={(e) => updateData(key as keyof WizardData, e.target.checked)}
                    className="mr-3"
                  />
                  <label className="text-sm">{label}</label>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-3">Características Adicionales</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Ej: Rines de aleación, Quemacocos, GPS..."
                  className="flex-1 p-2 border rounded-md text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement
                      const value = input.value.trim()
                      if (value && !data.caracteristicasPersonalizadas.includes(value)) {
                        updateData('caracteristicasPersonalizadas', [...data.caracteristicasPersonalizadas, value])
                        input.value = ''
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement
                    const value = input.value.trim()
                    if (value && !data.caracteristicasPersonalizadas.includes(value)) {
                      updateData('caracteristicasPersonalizadas', [...data.caracteristicasPersonalizadas, value])
                      input.value = ''
                    }
                  }}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                >
                  Agregar
                </button>
              </div>
              
              {data.caracteristicasPersonalizadas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.caracteristicasPersonalizadas.map((caracteristica, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {caracteristica}
                      <button
                        type="button"
                        onClick={() => {
                          const nuevas = data.caracteristicasPersonalizadas.filter((_, i) => i !== index)
                          updateData('caracteristicasPersonalizadas', nuevas)
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Imágenes del Vehículo</h2>
            <p className="text-gray-600 mb-6">Sube tus propias imágenes o usa IA para encontrar fotos similares</p>
            
            <div className="space-y-6">
              <AIImageGenerator 
                carData={data}
                onSelectImages={(images) => updateData('imagenes', images)}
              />
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">O sube tus propias imágenes</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    if (files.length > 5) {
                      alert('Máximo 5 imágenes permitidas')
                      return
                    }
                    
                    const imageUrls: string[] = []
                    files.forEach((file, index) => {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        imageUrls[index] = event.target?.result as string
                        if (imageUrls.filter(Boolean).length === files.length) {
                          updateData('imagenes', imageUrls.filter(Boolean))
                        }
                      }
                      reader.readAsDataURL(file)
                    })
                  }}
                  className="hidden"
                  id="imageUpload"
                />
                <label htmlFor="imageUpload" className="cursor-pointer">
                  <div className="text-gray-400 mb-2">
                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Haz clic para subir imágenes</p>
                  <p className="text-sm text-gray-500">PNG, JPG hasta 5MB cada una</p>
                </label>
              </div>
              
              {data.imagenes.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {data.imagenes.map((imagen, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imagen}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const nuevasImagenes = data.imagenes.filter((_, i) => i !== index)
                          updateData('imagenes', nuevasImagenes)
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
                <p className="text-sm text-gray-500">
                  💡 Tip: Las imágenes de buena calidad aumentan las posibilidades de venta
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Descripción y Opciones</h2>
            
            <div className="space-y-6">
              <AIDescriptionGenerator 
                carData={data}
                onGenerate={(description) => updateData('descripcion', description)}
              />
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Descripción del vehículo * (mínimo 20 caracteres)
                </label>
                <textarea
                  value={data.descripcion}
                  onChange={(e) => updateData('descripcion', e.target.value)}
                  placeholder="Escribe tu propia descripción o usa el asistente de IA de arriba..."
                  rows={6}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {data.descripcion.length}/20 caracteres mínimos
                </p>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Opciones de Publicación</h3>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={data.enSlideshow}
                      onChange={(e) => updateData('enSlideshow', e.target.checked)}
                      className="mr-3 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        ⭐ Destacar en slideshow principal
                      </label>
                      <p className="text-xs text-gray-600 mt-1">
                        Tu anuncio aparecerá en el slideshow de la página principal para mayor visibilidad
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </button>

        {currentStep < 6 ? (
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed()}
            className="px-6 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600"
          >
            Publicar Vehículo
          </button>
        )}
      </div>
    </div>
  )
}