import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { carData } = await request.json()
    
    // Obtener usuarios que quieren recibir notificaciones
    const usersToNotify = await prisma.user.findMany({
      where: {
        emailNotifications: true,
        userType: 'BUYER'
      },
      select: {
        email: true,
        firstName: true
      }
    })

    // Crear notificaciones por email
    const notifications = usersToNotify.map(user => ({
      email: user.email,
      subject: `Nuevo coche disponible: ${carData.marca} ${carData.modelo}`,
      content: `
        Hola ${user.firstName},
        
        Hay un nuevo coche disponible en V&R Autos:
        
        🚗 ${carData.marca} ${carData.modelo} ${carData.año}
        💰 $${carData.precio.toLocaleString()} MXN
        📍 ${carData.kilometraje.toLocaleString()} km
        ⛽ ${carData.combustible}
        
        ${carData.descripcion}
        
        ¡No te lo pierdas! Visita nuestro sitio para más detalles.
        
        Saludos,
        Equipo V&R Autos
      `
    }))

    await prisma.emailNotification.createMany({
      data: notifications
    })

    return NextResponse.json({
      message: `Notificaciones creadas para ${notifications.length} usuarios`,
      count: notifications.length
    })

  } catch (error) {
    console.error('Error creando notificaciones:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const pendingNotifications = await prisma.emailNotification.findMany({
      where: { sent: false },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      notifications: pendingNotifications,
      count: pendingNotifications.length
    })

  } catch (error) {
    console.error('Error obteniendo notificaciones:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}