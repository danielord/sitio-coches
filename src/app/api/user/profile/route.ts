import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      userId,
      firstName, 
      lastName, 
      phone, 
      address, 
      city, 
      state, 
      zipCode, 
      emailNotifications, 
      avatar 
    } = body

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone,
        address,
        city,
        state,
        zipCode,
        emailNotifications,
        avatar
      }
    })

    return NextResponse.json({
      message: 'Perfil actualizado exitosamente',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city,
        state: updatedUser.state,
        zipCode: updatedUser.zipCode,
        userType: updatedUser.userType,
        emailNotifications: updatedUser.emailNotifications,
        avatar: updatedUser.avatar
      }
    })

  } catch (error) {
    console.error('Error actualizando perfil:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}