import Link from 'next/link'
import Image from 'next/image'
import { Car, ArrowLeft, Phone, Mail, Calendar, Gauge, Fuel, Settings } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function CocheDetallePage({ params }: { params: { id: string } }) {
  const coche = await prisma.coche.findUnique({
    where: { id: params.id, activo: true },
    include: {
      vendedor: {
        select: {
          nombre: true,
          telefono: true,
          email: true,
        },
      },
    },
  })

  if (!coche) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <Car className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SitioCoches</span>
            </Link>
            <Link href="/coches" className="btn-secondary flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Coches
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Imágenes */}
          <div>
            {coche.imagenes.length > 0 ? (
              <div className="space-y-4">
                <Image
                  src={coche.imagenes[0]}
                  alt={`${coche.marca} ${coche.modelo}`}
                  width={600}
                  height={400}
                  className="w-full rounded-lg object-cover"
                />
                {coche.imagenes.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {coche.imagenes.slice(1, 4).map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        alt={`${coche.marca} ${coche.modelo} ${index + 2}`}
                        width={200}
                        height={150}
                        className="rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <Car className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>

          {/* Información */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {coche.marca} {coche.modelo}
            </h1>
            <p className="text-4xl font-bold text-primary-600 mb-6">
              €{coche.precio.toLocaleString()}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span>{coche.año}</span>
              </div>
              <div className="flex items-center">
                <Gauge className="h-5 w-5 text-gray-400 mr-2" />
                <span>{coche.kilometraje.toLocaleString()} km</span>
              </div>
              <div className="flex items-center">
                <Fuel className="h-5 w-5 text-gray-400 mr-2" />
                <span>{coche.combustible}</span>
              </div>
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-gray-400 mr-2" />
                <span>{coche.transmision}</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">{coche.descripcion}</p>
            </div>

            {/* Información del vendedor */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Contactar Vendedor</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="font-medium">{coche.vendedor.nombre}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <a href={`tel:${coche.vendedor.telefono}`} className="text-primary-600 hover:text-primary-700">
                    {coche.vendedor.telefono}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <a href={`mailto:${coche.vendedor.email}`} className="text-primary-600 hover:text-primary-700">
                    {coche.vendedor.email}
                  </a>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <a
                  href={`tel:${coche.vendedor.telefono}`}
                  className="w-full btn-primary text-center block"
                >
                  Llamar Ahora
                </a>
                <a
                  href={`mailto:${coche.vendedor.email}?subject=Interés en ${coche.marca} ${coche.modelo}`}
                  className="w-full btn-secondary text-center block"
                >
                  Enviar Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}