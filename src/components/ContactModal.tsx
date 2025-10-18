'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, Phone, Mail, Send } from 'lucide-react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  vendedor: {
    nombre: string
    telefono: string
    email: string
  }
  coche: {
    marca: string
    modelo: string
    año: number
    precio: number
  }
}

export default function ContactModal({ isOpen, onClose, vendedor, coche }: ContactModalProps) {
  const [mensaje, setMensaje] = useState('')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)

    // Simular envío de mensaje
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Crear enlace mailto como fallback
    const subject = `Interés en ${coche.marca} ${coche.modelo} ${coche.año}`
    const body = `Hola ${vendedor.nombre},

Estoy interesado en tu ${coche.marca} ${coche.modelo} ${coche.año} por €${coche.precio.toLocaleString()}.

${mensaje}

Mis datos de contacto:
- Nombre: ${nombre}
- Email: ${email}
- Teléfono: ${telefono}

Saludos.`

    const mailtoLink = `mailto:${vendedor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink)

    setEnviando(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg max-w-md w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Contactar Vendedor</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6">
              {/* Info del coche */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold">{coche.marca} {coche.modelo} {coche.año}</h3>
                <p className="text-primary-600 font-bold">€{coche.precio.toLocaleString()}</p>
              </div>

              {/* Info del vendedor */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Vendedor: {vendedor.nombre}</h4>
                <div className="space-y-2">
                  <a
                    href={`tel:${vendedor.telefono}`}
                    className="flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {vendedor.telefono}
                  </a>
                  <a
                    href={`mailto:${vendedor.email}`}
                    className="flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {vendedor.email}
                  </a>
                </div>
              </div>

              {/* Formulario de contacto */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu teléfono
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
                    placeholder="Hola, estoy interesado en este coche..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  {enviando ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>

              {/* Acciones rápidas */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-3">O contacta directamente:</p>
                <div className="flex gap-2">
                  <a
                    href={`tel:${vendedor.telefono}`}
                    className="flex-1 btn-secondary text-center flex items-center justify-center"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Llamar
                  </a>
                  <a
                    href={`https://wa.me/${vendedor.telefono.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-center flex items-center justify-center transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}