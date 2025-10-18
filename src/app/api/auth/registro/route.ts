import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { nombre, email, telefono, password } = await request.json()

    // Verificar si el email ya existe
    const existingUser = await prisma.vendedor.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'El email ya está registrado' },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear vendedor
    const vendedor = await prisma.vendedor.create({
      data: {
        nombre,
        email,
        telefono,
        password: hashedPassword,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        fechaRegistro: true,
      }
    })

    return NextResponse.json(vendedor, { status: 201 })
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}