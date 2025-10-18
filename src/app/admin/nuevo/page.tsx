import Link from 'next/link'
import { Car, ArrowLeft } from 'lucide-react'
import FormularioCoche from '@/components/FormularioCoche'

export default function NuevoCochePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <Car className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SitioCoches Admin</span>
            </Link>
            <Link href="/admin" className="btn-secondary flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Admin
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FormularioCoche />
      </div>
    </div>
  )
}