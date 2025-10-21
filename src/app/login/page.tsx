'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      alert('Completa todos los campos')
      return
    }

    setLoading(true)
    
    // Crear usuario inmediatamente
    const userData = {
      id: Date.now().toString(),
      email: email,
      name: email.split('@')[0],
      firstName: email.split('@')[0],
      userType: 'vendedor',
      loginTime: Date.now()
    }
    
    try {
      localStorage.setItem('user', JSON.stringify(userData))
      console.log('Usuario guardado:', userData)
      
      // Redirigir inmediatamente
      setTimeout(() => {
        window.location.replace('/admin')
      }, 100)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al iniciar sesión')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <img src="/logo.jpg" alt="V&R Autos" className="h-16 w-16 rounded-full mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
          <p className="text-gray-600">Accede a tu panel de vendedor</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                placeholder="admin@vrautos.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                placeholder="admin123"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-primary-600 hover:text-primary-700">
              Regístrate aquí
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            ← Volver al sitio
          </Link>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">Usa cualquier email y contraseña</p>
          <p className="text-sm text-blue-700">Ejemplo: test@test.com / 123</p>
        </div>
      </div>
    </div>
  )
}