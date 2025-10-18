import Link from 'next/link'
import { Car, Search, Users, Shield, Heart } from 'lucide-react'
import HeroSlideshow from '@/components/HeroSlideshow'
import AnimatedBackground from '@/components/AnimatedBackground'
import AnimatedSection from '@/components/AnimatedSection'

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SitioCoches</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/coches" className="text-gray-500 hover:text-gray-900 transition-colors">Coches</Link>
              <Link href="/favoritos" className="text-gray-500 hover:text-gray-900 transition-colors flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                Favoritos
              </Link>
              <Link href="/auth/registro" className="text-gray-500 hover:text-gray-900 transition-colors">Vender</Link>
              <Link href="/auth/login" className="btn-primary">Iniciar Sesión</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Slideshow */}
      <HeroSlideshow />

      {/* Features */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Por qué elegirnos?</h2>
            <p className="text-xl text-gray-600">La mejor experiencia en compra y venta de coches</p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection delay={0.2} className="text-center group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Búsqueda Avanzada</h3>
                <p className="text-gray-600">Filtra por marca, modelo, precio y más con nuestro sistema inteligente</p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.4} className="text-center group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="bg-gradient-to-br from-green-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Coches Verificados</h3>
                <p className="text-gray-600">Todos los anuncios pasan por nuestro sistema de verificación con IA</p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.6} className="text-center group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Vendedores Confiables</h3>
                <p className="text-gray-600">Conectamos compradores y vendedores verificados de forma segura</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}