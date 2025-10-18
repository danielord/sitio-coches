import { NextRequest, NextResponse } from 'next/server'
import { subirImagen } from '@/lib/cloudflare-images'
import { analizarImagenCoche } from '@/lib/rekognition'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó archivo' },
        { status: 400 }
      )
    }

    // Analizar imagen con AWS Rekognition
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const analisis = await analizarImagenCoche(buffer)

    if (!analisis.esCoche) {
      return NextResponse.json(
        { error: 'La imagen no parece ser de un coche' },
        { status: 400 }
      )
    }

    if (analisis.contenidoInapropiado) {
      return NextResponse.json(
        { error: 'La imagen contiene contenido inapropiado' },
        { status: 400 }
      )
    }

    // Subir a Cloudflare Images
    const imageUrl = await subirImagen(file)

    return NextResponse.json({
      url: imageUrl,
      analisis: analisis.etiquetas
    })
  } catch (error) {
    console.error('Error en upload:', error)
    return NextResponse.json(
      { error: 'Error al subir imagen' },
      { status: 500 }
    )
  }
}