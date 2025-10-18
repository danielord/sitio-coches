import { NextRequest, NextResponse } from 'next/server'
import { generarDescripcionCoche } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const descripcion = await generarDescripcionCoche({
      marca: body.marca,
      modelo: body.modelo,
      año: body.año,
      kilometraje: body.kilometraje,
      combustible: body.combustible,
      transmision: body.transmision,
      color: body.color,
    })

    return NextResponse.json({ descripcion })
  } catch (error) {
    console.error('Error generando descripción:', error)
    return NextResponse.json(
      { error: 'Error al generar descripción' },
      { status: 500 }
    )
  }
}