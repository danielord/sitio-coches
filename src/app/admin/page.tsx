import Link from 'next/link'
import { Car, Plus, Users, BarChart3, LogOut } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/login')
  }

  const vendedor = await prisma.vendedor.findUnique({
    where: { email: session.user?.email! },
    include: {
      coches: true
    }
  })

  const totalCoches = vendedor?.coches.length || 0
  const cochesActivos = vendedor?.coches.filter(c => c.activo).length || 0
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <Car className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SitioCoches Admin</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Hola, {session.user?.name}</span>
              <Link href="/coches" className="btn-secondary">Ver Sitio</Link>
              <Link href="/api/auth/signout" className="text-gray-500 hover:text-gray-700">
                <LogOut className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona coches y vendedores</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Coches</p>
                <p className="text-2xl font-bold text-gray-900">{totalCoches}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vendedores</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{cochesActivos}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Gestión de Coches</h2>
            <p className="text-gray-600 mb-4">Añade, edita o elimina anuncios de coches</p>
            <div className="space-y-3">
              <Link href="/admin/nuevo" className="w-full btn-primary flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Añadir Nuevo Coche
              </Link>
              <Link href="/admin/dashboard" className="w-full btn-secondary text-center block">Ver Todos los Coches</Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Gestión de Vendedores</h2>
            <p className="text-gray-600 mb-4">Administra los vendedores registrados</p>
            <div className="space-y-3">
              <button className="w-full btn-primary flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Vendedor
              </button>
              <button className="w-full btn-secondary">Ver Todos los Vendedores</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}