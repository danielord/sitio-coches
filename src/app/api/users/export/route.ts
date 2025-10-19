import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        userType: true,
        emailNotifications: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Convertir a CSV
    const csvHeaders = [
      'ID',
      'Email',
      'Nombre',
      'Apellidos',
      'Teléfono',
      'Dirección',
      'Ciudad',
      'Estado',
      'Código Postal',
      'Tipo Usuario',
      'Notificaciones Email',
      'Fecha Registro'
    ]

    const csvRows = users.map(user => [
      user.id,
      user.email,
      user.firstName,
      user.lastName,
      user.phone || '',
      user.address || '',
      user.city || '',
      user.state || '',
      user.zipCode || '',
      user.userType === 'SELLER' ? 'Vendedor' : 'Comprador',
      user.emailNotifications ? 'Sí' : 'No',
      user.createdAt.toLocaleDateString('es-MX')
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="usuarios_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

  } catch (error) {
    console.error('Error exportando usuarios:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}