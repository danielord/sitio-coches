import { RekognitionClient, DetectLabelsCommand, DetectModerationLabelsCommand } from '@aws-sdk/client-rekognition'

const rekognition = new RekognitionClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function analizarImagenCoche(imageBuffer: Buffer) {
  try {
    // Detectar etiquetas en la imagen
    const labelsCommand = new DetectLabelsCommand({
      Image: { Bytes: imageBuffer },
      MaxLabels: 20,
      MinConfidence: 70,
    })
    
    const labelsResponse = await rekognition.send(labelsCommand)
    
    // Verificar moderación de contenido
    const moderationCommand = new DetectModerationLabelsCommand({
      Image: { Bytes: imageBuffer },
      MinConfidence: 60,
    })
    
    const moderationResponse = await rekognition.send(moderationCommand)
    
    // Filtrar etiquetas relacionadas con coches
    const cocheTags = labelsResponse.Labels?.filter(label => 
      ['Car', 'Vehicle', 'Automobile', 'Transportation', 'Sedan', 'SUV', 'Truck', 'Wheel', 'Tire']
        .some(tag => label.Name?.includes(tag))
    ) || []
    
    return {
      esCoche: cocheTags.length > 0,
      etiquetas: cocheTags.map(label => ({
        nombre: label.Name,
        confianza: label.Confidence
      })),
      contenidoInapropiado: (moderationResponse.ModerationLabels?.length || 0) > 0,
      moderacion: moderationResponse.ModerationLabels?.map(label => ({
        nombre: label.Name,
        confianza: label.Confidence
      })) || []
    }
  } catch (error) {
    console.error('Error analizando imagen:', error)
    return {
      esCoche: true, // Asumir que es válida si hay error
      etiquetas: [],
      contenidoInapropiado: false,
      moderacion: []
    }
  }
}