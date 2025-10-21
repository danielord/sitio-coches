'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, User, Mail, Phone, MapPin, Upload } from 'lucide-react'

function EditarUsuarioContent() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    userType: 'comprador',
    avatar: ''
  })
  const [loading, setLoading] = useState(false)
  const [userFound, setUserFound] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('id')

  useEffect(() => {
    if (userId) {
      loadUser(userId)
    }
  }, [userId])

  const loadUser = (id: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      console.log('Usuarios disponibles:', users)
      console.log('Buscando usuario con ID:', id)
      
      const user = users.find((u: any) => u.id === id)
      console.log('Usuario encontrado:', user)
      
      if (user) {
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          userType: user.userType || 'comprador',
          avatar: user.avatar || ''
        })
        setUserFound(true)
      } else {
        console.error('Usuario no encontrado con ID:', id)
        alert('Usuario no encontrado')
      }
    } catch (error) {
      console.error('Error loading user:', error)
      alert('Error al cargar usuario: ' + error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!userId) {
        alert('ID de usuario no válido')
        setLoading(false)
        return
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      if (users.length === 0) {
        alert('No se encontraron usuarios')
        setLoading(false)
        return
      }

      const userIndex = users.findIndex((user: any) => user.id === userId)
      
      if (userIndex === -1) {
        alert('Usuario no encontrado')
        setLoading(false)
        return
      }

      // Actualizar usuario
      users[userIndex] = {
        ...users[userIndex],
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        userType: formData.userType,
        avatar: formData.avatar,
        updatedAt: new Date().toISOString()
      }

      localStorage.setItem('users', JSON.stringify(users))
      alert('Usuario actualizado exitosamente')
      router.push('/admin/usuarios')
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error al actualizar usuario: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, avatar: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (!userFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Usuario no encontrado</p>
          <Link href="/admin/usuarios" className="btn-primary">
            Volver a Usuarios
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/admin" className="flex items-center">
              <img src="/logo.jpg" alt="V&R Autos" className="h-10 w-10 rounded-full" />
              <span className="ml-2 text-xl font-bold text-gray-900">V&R Autos Admin</span>
            </Link>
            <Link href="/admin/usuarios" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Usuarios
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Usuario</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto de Perfil
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <label className="cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Upload className="h-4 w-4 inline mr-2" />
                  Cambiar Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                Dirección
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Usuario
              </label>
              <select
                value={formData.userType}
                onChange={(e) => setFormData(prev => ({ ...prev, userType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="comprador">Comprador</option>
                <option value="vendedor">Vendedor</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>

            <div className="flex gap-4 pt-6">
              <Link
                href="/admin/usuarios"
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 text-center"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {loading ? 'Actualizando...' : 'Actualizar Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function EditarUsuarioPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <EditarUsuarioContent />
    </Suspense>
  )
}