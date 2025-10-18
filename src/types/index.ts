export interface Coche {
  id: string
  marca: string
  modelo: string
  año: number
  precio: number
  kilometraje: number
  combustible: 'Gasolina' | 'Diesel' | 'Eléctrico' | 'Híbrido'
  transmision: 'Manual' | 'Automática'
  color: string
  descripcion: string
  imagenes: string[]
  vendedorId: string
  vendedor: Vendedor
  fechaCreacion: Date
  activo: boolean
}

export interface Vendedor {
  id: string
  nombre: string
  email: string
  telefono: string
  fechaRegistro: Date
  coches: Coche[]
}

export interface FiltrosBusqueda {
  marca?: string
  modelo?: string
  añoMin?: number
  añoMax?: number
  precioMin?: number
  precioMax?: number
  combustible?: string
  transmision?: string
}