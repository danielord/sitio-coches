import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
        descripcion: body.descripcion,
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