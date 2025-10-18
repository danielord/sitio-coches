import { NextRequest, NextResponse } from 'next/server'
import { analizarImagenCoche } from '@/lib/rekognition'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('imagen') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó imagen' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const analisis = await analizarImagenCoche(buffer)

    return NextResponse.json(analisis)
  } catch (error) {
    console.error('Error analizando imagen:', error)
    return NextResponse.json(
      { error: 'Error al analizar imagen' },
      { status: 500 }
    )
  }
}