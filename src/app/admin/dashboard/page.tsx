'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Car, ArrowLeft, Edit, Trash2, Eye } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { api } from '@/lib/api'
import Image from 'next/image'

export default function DashboardPage() {
  const [auth, setAuth] = useState(authClient.getAuth())
  const [coches, setCoches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!auth.user) {
      router.push('/auth/login')
      return
    }

    const loadCoches = async () => {
      try {
        const vendedores = await api.getVendedores(auth.user!.email)
        const vendedor = vendedores[0]
        if (vendedor?.coches) {
          setCoches(vendedor.coches)
        }
      } catch (error) {
        console.error('Error loading coches:', error)
      }
      setLoading(false)
    }

    loadCoches()
  }, [auth.user, router])

  if (!auth.user || loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <Car className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Mis Coches</span>
            </Link>
            <Link href="/admin" className="btn-secondary flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Admin
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Coches</h1>
            <p className="text-gray-600">Gestiona tus anuncios publicados</p>
          </div>
          <Link href="/admin/nuevo" className="btn-primary">
            Añadir Nuevo Coche
          </Link>
        </div>

        {coches.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes coches publicados</h3>
            <p className="text-gray-600 mb-4">Comienza publicando tu primer coche</p>
            <Link href="/admin/nuevo" className="btn-primary">
              Publicar Primer Coche
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {coches.map((coche: any) => (
              <div key={coche.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-48 h-48 bg-gray-200 flex items-center justify-center">
                    {coche.imagenes.length > 0 ? (
                      <Image
                        src={coche.imagenes[0]}
                        alt={`${coche.marca} ${coche.modelo}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Car className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {coche.marca} {coche.modelo} {coche.año}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {coche.kilometraje.toLocaleString()} km • {coche.combustible} • {coche.transmision}
                        </p>
                        <p className="text-2xl font-bold text-primary-600 mt-2">
                          €{coche.precio.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Publicado: {new Date(coche.fechaCreacion).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          coche.activo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {coche.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-3">
                      <Link
                        href={`/coches/${coche.id}`}
                        className="btn-secondary flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Link>
                      <button className="btn-secondary flex items-center">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </button>
                      <button className="text-red-600 hover:text-red-700 px-3 py-2 rounded-md border border-red-300 hover:border-red-400 flex items-center">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}