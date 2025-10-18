import Link from 'next/link'
import { Car, Search, Users, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SitioCoches</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/coches" className="text-gray-500 hover:text-gray-900">Coches</Link>
              <Link href="/vender" className="text-gray-500 hover:text-gray-900">Vender</Link>
              <Link href="/admin" className="btn-primary">Admin</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Encuentra tu coche ideal
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Miles de coches verificados esperándote
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/coches" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Ver Coches
              </Link>
              <Link href="/vender" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                Vender mi Coche
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Search className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Búsqueda Avanzada</h3>
              <p className="text-gray-600">Filtra por marca, modelo, precio y más</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Coches Verificados</h3>
              <p className="text-gray-600">Todos los anuncios son revisados</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Vendedores Confiables</h3>
              <p className="text-gray-600">Conectamos compradores y vendedores</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}