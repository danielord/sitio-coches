'use client'

import { useState, useRef, useEffect } from 'react'
import { RotateCw, ZoomIn, ZoomOut, Crop, Check, X, Move } from 'lucide-react'

interface ImageEditorProps {
  imageFile: File
  onSave: (editedImage: string) => void
  onCancel: () => void
}

export default function ImageEditor({ imageFile, onSave, onCancel }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [cropMode, setCropMode] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const img = new window.Image()
    img.onload = () => {
      setImage(img)
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = 600
        canvas.height = 400
        drawImage()
      }
    }
    img.src = URL.createObjectURL(imageFile)
  }, [imageFile])

  useEffect(() => {
    if (image) {
      drawImage()
    }
  }, [image, scale, rotation, imagePosition])

  const drawImage = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !image) return

    // Fondo blanco en lugar de transparente
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.save()

    // Centrar y aplicar transformaciones
    const centerX = canvas.width / 2 + imagePosition.x
    const centerY = canvas.height / 2 + imagePosition.y
    
    ctx.translate(centerX, centerY)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(scale, scale)

    // Mantener proporción original pero ajustar al canvas
    const maxWidth = canvas.width * 0.9
    const maxHeight = canvas.height * 0.9
    let drawWidth = image.width
    let drawHeight = image.height
    
    // Escalar solo si es necesario
    if (drawWidth > maxWidth || drawHeight > maxHeight) {
      const scaleRatio = Math.min(maxWidth / drawWidth, maxHeight / drawHeight)
      drawWidth *= scaleRatio
      drawHeight *= scaleRatio
    }

    ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
    ctx.restore()

    // Dibujar área de recorte si está activa
    if (cropMode && crop.width > 0 && crop.height > 0) {
      ctx.strokeStyle = '#3B82F6'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.strokeRect(crop.x, crop.y, crop.width, crop.height)
      
      // Oscurecer área fuera del recorte
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.clearRect(crop.x, crop.y, crop.width, crop.height)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (cropMode) {
      setCrop({ x, y, width: 0, height: 0 })
    } else {
      setIsDragging(true)
      setDragStart({ x: x - imagePosition.x, y: y - imagePosition.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (cropMode && e.buttons === 1) {
      setCrop(prev => ({
        ...prev,
        width: x - prev.x,
        height: y - prev.y
      }))
      drawImage()
    } else if (isDragging) {
      setImagePosition({
        x: x - dragStart.x,
        y: y - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    let finalCanvas = canvas
    
    // Si hay recorte, crear nuevo canvas con el área recortada
    if (cropMode && crop.width > 0 && crop.height > 0) {
      const cropCanvas = document.createElement('canvas')
      const cropCtx = cropCanvas.getContext('2d')
      if (!cropCtx) return

      cropCanvas.width = Math.abs(crop.width)
      cropCanvas.height = Math.abs(crop.height)
      
      cropCtx.drawImage(
        canvas,
        crop.x, crop.y, crop.width, crop.height,
        0, 0, cropCanvas.width, cropCanvas.height
      )
      finalCanvas = cropCanvas
    }

    // Optimizar manteniendo mejor calidad
    const optimizedCanvas = document.createElement('canvas')
    const optimizedCtx = optimizedCanvas.getContext('2d')
    if (!optimizedCtx) return

    // Redimensionar a máximo 1200x900 para mejor calidad
    const maxWidth = 1200
    const maxHeight = 900
    let { width, height } = finalCanvas

    // Solo redimensionar si es realmente necesario
    if (width > maxWidth || height > maxHeight) {
      const scaleRatio = Math.min(maxWidth / width, maxHeight / height)
      width *= scaleRatio
      height *= scaleRatio
    }

    optimizedCanvas.width = width
    optimizedCanvas.height = height
    
    // Fondo blanco
    optimizedCtx.fillStyle = '#FFFFFF'
    optimizedCtx.fillRect(0, 0, width, height)
    
    // Dibujar imagen con suavizado
    optimizedCtx.imageSmoothingEnabled = true
    optimizedCtx.imageSmoothingQuality = 'high'
    optimizedCtx.drawImage(finalCanvas, 0, 0, width, height)

    const editedImage = optimizedCanvas.toDataURL('image/jpeg', 0.9)
    onSave(editedImage)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Editor de Imagen</h3>
          <div className="flex gap-2">
            <button onClick={onCancel} className="p-2 text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="mb-4 flex justify-center">
          <canvas
            ref={canvasRef}
            className="border border-gray-300 cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        {/* Controles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* Zoom */}
          <div>
            <label className="block text-sm font-medium mb-2">Zoom</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScale(Math.max(0.1, scale - 0.1))}
                className="p-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-sm min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
              <button
                onClick={() => setScale(Math.min(3, scale + 0.1))}
                className="p-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Rotación */}
          <div>
            <label className="block text-sm font-medium mb-2">Rotación</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRotation((rotation - 90) % 360)}
                className="p-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                <RotateCw className="h-4 w-4 transform rotate-180" />
              </button>
              <span className="text-sm min-w-[3rem] text-center">{rotation}°</span>
              <button
                onClick={() => setRotation((rotation + 90) % 360)}
                className="p-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Recorte */}
          <div>
            <label className="block text-sm font-medium mb-2">Recorte</label>
            <button
              onClick={() => {
                setCropMode(!cropMode)
                setCrop({ x: 0, y: 0, width: 0, height: 0 })
              }}
              className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${
                cropMode ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Crop className="h-4 w-4" />
              {cropMode ? 'Activo' : 'Inactivo'}
            </button>
          </div>

          {/* Mover */}
          <div>
            <label className="block text-sm font-medium mb-2">Posición</label>
            <button
              onClick={() => setImagePosition({ x: 0, y: 0 })}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
            >
              <Move className="h-4 w-4" />
              Centrar
            </button>
          </div>
        </div>

        {/* Información */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Instrucciones:</strong>
          </p>
          <ul className="text-sm text-blue-700 mt-1 space-y-1">
            <li>• Usa los controles para ajustar zoom y rotación</li>
            <li>• Activa "Recorte" y arrastra en el canvas para seleccionar área</li>
            <li>• Arrastra la imagen para moverla (cuando recorte esté inactivo)</li>
            <li>• Calidad alta: hasta 1200x900px, 90% JPEG, fondo blanco</li>
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Guardar Imagen
          </button>
        </div>
      </div>
    </div>
  )
}