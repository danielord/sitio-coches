'use client'

import { useState } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'

interface AIDescriptionGeneratorProps {
  carData: any
  onGenerate: (description: string) => void
}

export default function AIDescriptionGenerator({ carData, onGenerate }: AIDescriptionGeneratorProps) {
  const [generating, setGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('profesional')

  const templates = {
    profesional: {
      name: 'Profesional',
      description: 'Descripción formal y detallada'
    },
    comercial: {
      name: 'Comercial',
      description: 'Enfoque en ventas y beneficios'
    },
    detallado: {
      name: 'Detallado',
      description: 'Información técnica completa'
    }
  }

  const generateDescription = async () => {
    setGenerating(true)
    
    // Simular delay de IA
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const equipamientoBasico = Object.entries(carData)
      .filter(([key, value]) => 
        ['aireAcondicionado', 'direccionHidraulica', 'vidriosElectricos', 'segurosElectricos', 'stereo', 'alarma'].includes(key) && value
      )
      .map(([key]) => {
        const nombres = {
          aireAcondicionado: 'aire acondicionado',
          direccionHidraulica: 'dirección hidráulica',
          vidriosElectricos: 'vidrios eléctricos', 
          segurosElectricos: 'seguros eléctricos',
          stereo: 'sistema de audio',
          alarma: 'sistema de alarma'
        }
        return nombres[key as keyof typeof nombres]
      })
    
    const equipamiento = [...equipamientoBasico, ...(carData.caracteristicasPersonalizadas || [])]

    let description = ''

    switch (selectedTemplate) {
      case 'profesional':
        description = `Se vende ${carData.marca} ${carData.modelo} ${carData.año} en ${carData.estado.toLowerCase()} estado de conservación. El vehículo cuenta con ${carData.kilometraje} kilómetros recorridos, motor ${carData.combustible.toLowerCase()} y transmisión ${carData.transmision.toLowerCase()}. 

Características principales:
• Color: ${carData.color}
• Puertas: ${carData.puertas}
• Estado: ${carData.estado}
${equipamiento.length > 0 ? `• Equipamiento: ${equipamiento.join(', ')}\n` : ''}
Vehículo ideal para uso diario, con mantenimiento preventivo al día. Papeles en regla y listo para transferir. ${carData.negociable ? 'Precio sujeto a negociación.' : 'Precio fijo.'}`
        break

      case 'comercial':
        description = `¡OPORTUNIDAD ÚNICA! ${carData.marca} ${carData.modelo} ${carData.año} - ¡No te lo pierdas!

✅ Solo ${carData.kilometraje} km
✅ Motor ${carData.combustible} económico
✅ Transmisión ${carData.transmision.toLowerCase()}
✅ Color ${carData.color.toLowerCase()} elegante
${equipamiento.length > 0 ? `✅ Incluye: ${equipamiento.join(', ')}\n` : ''}
🔥 Estado: ${carData.estado}
🔥 ${carData.puertas} puertas - Perfecto para la familia
🔥 Mantenimiento al día

${carData.negociable ? '💰 ¡PRECIO NEGOCIABLE!' : '💰 PRECIO ESPECIAL'} - ¡Llama YA!`
        break

      case 'detallado':
        description = `${carData.marca} ${carData.modelo} ${carData.año} - Especificaciones Completas

INFORMACIÓN TÉCNICA:
- Kilometraje: ${carData.kilometraje} km
- Combustible: ${carData.combustible}
- Transmisión: ${carData.transmision}
- Color exterior: ${carData.color}
- Número de puertas: ${carData.puertas}
- Estado general: ${carData.estado}

EQUIPAMIENTO INCLUIDO:
${equipamiento.length > 0 ? equipamiento.map(item => `- ${item.charAt(0).toUpperCase() + item.slice(1)}`).join('\n') : '- Equipamiento estándar de fábrica'}

CONDICIONES DE VENTA:
- Vehículo con mantenimiento preventivo actualizado
- Documentación en regla para transferencia inmediata
- ${carData.negociable ? 'Precio negociable según forma de pago' : 'Precio fijo, sin regateos'}
- Disponible para prueba de manejo con cita previa

Ideal para personas que buscan confiabilidad y economía en un solo vehículo.`
        break
    }

    onGenerate(description)
    setGenerating(false)
  }

  return (
    <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-purple-600" />
        <h3 className="font-medium text-gray-900">Asistente de Descripción IA</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estilo de descripción:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(templates).map(([key, template]) => (
              <button
                key={key}
                onClick={() => setSelectedTemplate(key)}
                className={`p-2 text-xs rounded-md border transition-all ${
                  selectedTemplate === key
                    ? 'bg-purple-100 border-purple-300 text-purple-800'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{template.name}</div>
                <div className="text-xs opacity-75">{template.description}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateDescription}
          disabled={generating}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Generando descripción...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generar Descripción con IA
            </>
          )}
        </button>
      </div>
    </div>
  )
}