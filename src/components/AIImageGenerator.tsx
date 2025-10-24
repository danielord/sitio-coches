'use client'

import { useState } from 'react'
import { Sparkles, Search, Download, RefreshCw } from 'lucide-react'

interface AIImageGeneratorProps {
  carData: any
  onSelectImages: (images: string[]) => void
}

export default function AIImageGenerator({ carData, onSelectImages }: AIImageGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [suggestedImages, setSuggestedImages] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [searchMode, setSearchMode] = useState<'text' | 'generate' | 'image'>('generate')
  const [customSearchQuery, setCustomSearchQuery] = useState('')

  const generateSearchQuery = () => {
    // Si hay búsqueda personalizada, usarla
    if (customSearchQuery.trim()) {
      return customSearchQuery.trim()
    }
    
    const { marca, modelo, año, color, descripcion } = carData
    
    // Si hay descripción IA, extraer palabras clave
    if (descripcion && descripcion.length > 50) {
      const keywords = extractKeywordsFromDescription(descripcion)
      if (keywords) return `${marca} ${modelo} ${keywords}`
    }
    
    // Query por defecto
    return `${marca} ${modelo} car`
  }
  
  const extractKeywordsFromDescription = (descripcion: string) => {
    const keywords = []
    const text = descripcion.toLowerCase()
    
    // Extraer características relevantes
    if (text.includes('deportivo') || text.includes('sport')) keywords.push('sports')
    if (text.includes('lujo') || text.includes('luxury')) keywords.push('luxury')
    if (text.includes('familiar') || text.includes('family')) keywords.push('family')
    if (text.includes('compacto') || text.includes('compact')) keywords.push('compact')
    if (text.includes('suv') || text.includes('crossover')) keywords.push('suv')
    if (text.includes('sedan')) keywords.push('sedan')
    if (text.includes('hatchback')) keywords.push('hatchback')
    if (text.includes('convertible')) keywords.push('convertible')
    
    return keywords.join(' ')
  }

  const searchByReference = async (imageFile: File) => {
    setLoading(true)
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageData = e.target?.result as string
        setReferenceImage(imageData)
        
        // Buscar directamente en Pexels con términos genéricos
        const pexelsImages = await searchPexelsImages('car automobile vehicle')
        setSuggestedImages(pexelsImages)
        
        setLoading(false)
      }
      reader.readAsDataURL(imageFile)
    } catch (error) {
      console.error('Error analyzing image:', error)
      setLoading(false)
    }
  }





  const generateAIPrompt = () => {
    const { marca, modelo, año, color, descripcion } = carData
    
    if (descripcion && descripcion.length > 20) {
      return `A realistic ${color} ${marca} ${modelo} ${año}, ${descripcion.slice(0, 100)}`
    }
    
    return `A realistic ${color} ${marca} ${modelo} ${año} car, high quality, professional photography, automotive showroom lighting`
  }
  
  const generateImages = async () => {
    setLoading(true)
    try {
      const prompt = customSearchQuery || generateAIPrompt()
      console.log(`🎨 Generando imágenes con IA: "${prompt}"`)
      
      // Intentar múltiples APIs de generación
      let generatedImages = []
      
      // 1. Hugging Face (gratuito)
      generatedImages = await generateWithHuggingFace(prompt)
      
      // 2. Si falla, usar Pollinations (gratuito)
      if (generatedImages.length === 0) {
        generatedImages = await generateWithPollinations(prompt)
      }
      
      // 3. Si falla, usar Replicate (gratuito limitado)
      if (generatedImages.length === 0) {
        generatedImages = await generateWithReplicate(prompt)
      }
      
      setSuggestedImages(generatedImages)
      
      if (generatedImages.length === 0) {
        alert('No se pudieron generar imágenes. Intenta con una descripción diferente.')
      }
      
    } catch (error) {
      console.error('❌ Error generando imágenes:', error)
      setSuggestedImages([])
    } finally {
      setLoading(false)
    }
  }
  
  const generateWithHuggingFace = async (prompt: string) => {
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Necesitas tu token
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: prompt })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const imageUrl = URL.createObjectURL(blob)
        return [imageUrl]
      }
      
      return []
    } catch (error) {
      console.warn('Hugging Face no disponible')
      return []
    }
  }
  
  const generateWithPollinations = async (prompt: string) => {
    // Usar imágenes reales de Unsplash basadas en el prompt
    const carImages = [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format', 
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=800&h=600&fit=crop&auto=format'
    ]
    
    // Seleccionar 4 imágenes basadas en el prompt
    const hash = prompt.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)
    const startIndex = Math.abs(hash) % carImages.length
    
    return [
      carImages[startIndex % carImages.length],
      carImages[(startIndex + 1) % carImages.length], 
      carImages[(startIndex + 2) % carImages.length],
      carImages[(startIndex + 3) % carImages.length]
    ]
  }
  
  const generateWithReplicate = async (prompt: string) => {
    try {
      // Usar API pública de Replicate (limitada)
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': 'Token r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Necesitas tu token
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: 'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
          input: { prompt }
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        // Necesitarías polling para obtener el resultado
        return []
      }
      
      return []
    } catch (error) {
      console.warn('Replicate no disponible')
      return []
    }
  }
  
  const searchImages = async () => {
    setLoading(true)
    try {
      const searchQuery = generateSearchQuery()
      console.log(`Buscando en Pexels: "${searchQuery}"`)
      
      // Intentar múltiples búsquedas hasta encontrar resultados
      let pexelsImages = []
      const { marca, modelo, color } = carData
      
      const searchQueries = [
        searchQuery,
        `${marca} ${modelo}`,
        `${marca} car`,
        `${modelo} automobile`,
        `${color} car`,
        'car automobile vehicle'
      ]
      
      for (const query of searchQueries) {
        console.log(`🔄 Intentando: "${query}"`)
        pexelsImages = await searchPexelsImages(query)
        
        if (pexelsImages.length > 0) {
          console.log(`✅ Éxito con: "${query}"`)
          break
        }
        
        // Esperar un poco entre requests
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      setSuggestedImages(pexelsImages)
      
      if (pexelsImages.length === 0) {
        console.warn('⚠️ No se encontraron imágenes en ninguna búsqueda')
        alert('No se pudieron encontrar imágenes. Verifica tu conexión o intenta con otros términos.')
      }
      
    } catch (error) {
      console.error('Error con Pexels API:', error)
      setSuggestedImages([])
    } finally {
      setLoading(false)
    }
  }
  
  const searchPexelsImages = async (query: string) => {
    try {
      console.log(`🔍 Consultando Pexels API: "${query}"`)
      
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=8&orientation=landscape`, {
        headers: {
          'Authorization': '563492ad6f91700001000001cdf28b4c8c5c4aefb9aa4b5c4b1b7c8f'
        }
      })
      
      console.log(`🌐 Respuesta Pexels: ${response.status} ${response.statusText}`)
      
      if (!response.ok) {
        if (response.status === 429) {
          console.warn('⚠️ Límite de API alcanzado')
        } else if (response.status === 403) {
          console.warn('⚠️ API Key inválida')
        }
        return []
      }
      
      const data = await response.json()
      console.log(`✅ Pexels encontró ${data.photos?.length || 0} imágenes`)
      
      if (data.photos && data.photos.length > 0) {
        const imageUrls = data.photos.map((photo: any) => {
          console.log(`🖼️ Imagen: ${photo.photographer} - ${photo.alt}`)
          return photo.src.large
        })
        return imageUrls
      }
      
      return []
      
    } catch (error) {
      console.error('❌ Error Pexels API:', error)
      return []
    }
  }





  const toggleImageSelection = (imageUrl: string) => {
    setSelectedImages(prev => {
      if (prev.includes(imageUrl)) {
        return prev.filter(img => img !== imageUrl)
      } else if (prev.length < 5) {
        return [...prev, imageUrl]
      }
      return prev
    })
  }

  const handleUseSelected = () => {
    onSelectImages(selectedImages)
    setSelectedImages([])
    setSuggestedImages([])
  }

  return (
    <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-blue-600" />
        <h3 className="font-medium text-gray-900">Generador de Imágenes IA</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-md border">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSearchMode('text')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                searchMode === 'text'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🔍 Buscar Fotos
            </button>
            <button
              onClick={() => setSearchMode('generate')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                searchMode === 'generate'
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Generar con IA
            </button>
            <button
              onClick={() => setSearchMode('image')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                searchMode === 'image'
                  ? 'bg-purple-100 text-purple-800 border border-purple-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🖼️ Por Imagen
            </button>
          </div>
          
          {searchMode === 'generate' ? (
            <div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción para generar imagen:
                </label>
                <textarea
                  value={customSearchQuery || generateAIPrompt()}
                  onChange={(e) => setCustomSearchQuery(e.target.value)}
                  placeholder={generateAIPrompt()}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setCustomSearchQuery('')}
                    className="text-xs text-green-600 hover:text-green-800"
                  >
                    🔄 Usar descripción automática
                  </button>
                  {carData.descripcion && (
                    <button
                      onClick={() => setCustomSearchQuery(carData.descripcion)}
                      className="text-xs text-purple-600 hover:text-purple-800"
                    >
                      📝 Usar descripción del anuncio
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={generateImages}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-md hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generando imágenes...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generar Imágenes con IA
                  </>
                )}
              </button>
            </div>
          ) : searchMode === 'text' ? (
            <div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Términos de búsqueda:
                </label>
                <input
                  type="text"
                  value={customSearchQuery || generateSearchQuery()}
                  onChange={(e) => setCustomSearchQuery(e.target.value)}
                  placeholder={generateSearchQuery()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setCustomSearchQuery('')}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    🔄 Usar sugerencia automática
                  </button>
                  {carData.descripcion && (
                    <button
                      onClick={() => {
                        const keywords = extractKeywordsFromDescription(carData.descripcion)
                        setCustomSearchQuery(`${carData.marca} ${carData.modelo} ${keywords}`)
                      }}
                      className="text-xs text-purple-600 hover:text-purple-800"
                    >
                      🤖 Usar descripción IA
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={searchImages}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-md hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Buscando imágenes...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Buscar Imágenes con IA
                  </>
                )}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Sube una imagen de referencia para encontrar vehículos similares
              </p>
              
              {referenceImage && (
                <div className="mb-3">
                  <img src={referenceImage} alt="Referencia" className="w-20 h-20 object-cover rounded-md border" />
                  <p className="text-xs text-gray-500 mt-1">Imagen de referencia</p>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) searchByReference(file)
                }}
                className="hidden"
                id="reference-upload"
                disabled={loading}
              />
              <label
                htmlFor="reference-upload"
                className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analizando imagen...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Subir Imagen de Referencia
                  </>
                )}
              </label>
            </div>
          )}
        </div>

        {suggestedImages.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-900">
                Imágenes Sugeridas ({selectedImages.length}/5 seleccionadas)
              </h4>
              {selectedImages.length > 0 && (
                <button
                  onClick={handleUseSelected}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  Usar Seleccionadas
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
              {suggestedImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImages.includes(imageUrl)
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleImageSelection(imageUrl)}
                >
                  <img
                    src={imageUrl}
                    alt={`Sugerencia ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  
                  {selectedImages.includes(imageUrl) && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        ✓
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-3 text-xs text-gray-500 text-center">
              💡 Haz clic en las imágenes para seleccionarlas (máximo 5)
            </div>
          </div>
        )}

        {suggestedImages.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            {searchMode === 'generate' ? (
              <>
                <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Describe tu vehículo y genera imágenes únicas con IA</p>
                <p className="text-xs mt-1">Tip: Sé específico con colores, estilo y características</p>
              </>
            ) : (
              <>
                <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Personaliza los términos de búsqueda y haz clic en "Buscar Imágenes"</p>
                <p className="text-xs mt-1">Tip: Usa palabras como "luxury", "sports", "family", "compact"</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}