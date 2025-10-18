import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (email) {
      const vendedor = await prisma.vendedor.findUnique({
        where: { email },
        include: {
          coches: {
            where: {
              activo: true,
            },
          },
        },
      })
      return NextResponse.json(vendedor ? [vendedor] : [])
    }

    const vendedores = await prisma.vendedor.findMany({
      include: {
        coches: {
          where: {
            activo: true,
          },
        },
      },
      orderBy: {
        fechaRegistro: 'desc',
      },
    })

    return NextResponse.json(vendedores)
  } catch (error) {
    console.error('Error fetching vendedores:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const vendedor = await prisma.vendedor.create({
      data: {
        nombre: body.nombre,
        email: body.email,
        telefono: body.telefono,
      },
    })

    return NextResponse.json(vendedor, { status: 201 })
  } catch (error) {
    console.error('Error creating vendedor:', error)
    return NextResponse.json(
      { error: 'Error al crear el vendedor' },
      { status: 500 }
    )
  }
}