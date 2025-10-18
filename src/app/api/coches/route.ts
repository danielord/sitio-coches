import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generarDescripcionCoche } from '@/lib/openai'
import { moderarContenido } from '@/lib/cloudflare-ai'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const marca = searchParams.get('marca')
    const precioMax = searchParams.get('precioMax')
    const añoMin = searchParams.get('añoMin')

    const coches = await prisma.coche.findMany({
      where: {
        activo: true,
        ...(marca && { marca: { contains: marca, mode: 'insensitive' } }),
        ...(precioMax && { precio: { lte: parseFloat(precioMax) } }),
        ...(añoMin && { año: { gte: parseInt(añoMin) } }),
      },
      include: {
        vendedor: {
          select: {
            id: true,
            nombre: true,
            telefono: true,
          },
        },
      },
      orderBy: {
        fechaCreacion: 'desc',
      },
    })

    return NextResponse.json(coches)
  } catch (error) {
    console.error('Error fetching coches:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Generar descripción automática si no se proporciona
    let descripcion = body.descripcion
    if (!descripcion) {
      descripcion = await generarDescripcionCoche({
        marca: body.marca,
        modelo: body.modelo,
        año: body.año,
        kilometraje: body.kilometraje,
        combustible: body.combustible,
        transmision: body.transmision,
        color: body.color,
      })
    }
    
    // Moderar contenido
    const moderacion = await moderarContenido(descripcion)
    if (!moderacion.esApropiado) {
      return NextResponse.json(
        { error: 'Contenido inapropiado detectado' },
        { status: 400 }
      )
    }
    
    const coche = await prisma.coche.create({
      data: {
        marca: body.marca,
        modelo: body.modelo,
        año: body.año,
        precio: body.precio,
        kilometraje: body.kilometraje,
        combustible: body.combustible,
        transmision: body.transmision,
        color: body.color,
        descripcion,
        imagenes: body.imagenes || [],
        vendedorId: body.vendedorId,
      },
      include: {
        vendedor: true,
      },
    })

    return NextResponse.json(coche, { status: 201 })
  } catch (error) {
    console.error('Error creating coche:', error)
    return NextResponse.json(
      { error: 'Error al crear el coche' },
      { status: 500 }
    )
  }
}