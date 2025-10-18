'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, X, ChevronDown } from 'lucide-react'

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void
  loading?: boolean
}

export default function SearchFilters({ onFiltersChange, loading }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    busqueda: '',
    marca: '',
    precioMin: '',
    precioMax: '',
    añoMin: '',
    añoMax: '',
    combustible: '',
    transmision: '',
    kilometrajeMax: ''
  })

  const marcas = ['Toyota', 'Volkswagen', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Nissan', 'Hyundai']
  const combustibles = ['Gasolina', 'Diesel', 'Electrico', 'Hibrido']
  const transmisiones = ['Manual', 'Automatica']

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters = {
      busqueda: '',
      marca: '',
      precioMin: '',
      precioMax: '',
      añoMin: '',
      añoMax: '',
      combustible: '',
      transmision: '',
      kilometrajeMax: ''
    }
    setFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Búsqueda principal */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por marca, modelo..."
            value={filters.busqueda}
            onChange={(e) => handleFilterChange('busqueda', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Toggle filtros avanzados */}
      <div className="p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="flex items-center text-gray-700 font-medium">
            <Filter className="h-4 w-4 mr-2" />
            Filtros Avanzados
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-4 space-y-4">
            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
              <select
                value={filters.marca}
                onChange={(e) => handleFilterChange('marca', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Todas las marcas</option>
                {marcas.map(marca => (
                  <option key={marca} value={marca}>{marca}</option>
                ))}
              </select>
            </div>

            {/* Precio */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio mín (€)</label>
                <input
                  type="number"
                  value={filters.precioMin}
                  onChange={(e) => handleFilterChange('precioMin', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio máx (€)</label>
                <input
                  type="number"
                  value={filters.precioMax}
                  onChange={(e) => handleFilterChange('precioMax', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="100000"
                />
              </div>
            </div>

            {/* Año */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Año mín</label>
                <input
                  type="number"
                  value={filters.añoMin}
                  onChange={(e) => handleFilterChange('añoMin', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="2000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Año máx</label>
                <input
                  type="number"
                  value={filters.añoMax}
                  onChange={(e) => handleFilterChange('añoMax', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="2024"
                />
              </div>
            </div>

            {/* Combustible y Transmisión */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Combustible</label>
                <select
                  value={filters.combustible}
                  onChange={(e) => handleFilterChange('combustible', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Todos</option>
                  {combustibles.map(combustible => (
                    <option key={combustible} value={combustible}>{combustible}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transmisión</label>
                <select
                  value={filters.transmision}
                  onChange={(e) => handleFilterChange('transmision', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Todas</option>
                  {transmisiones.map(transmision => (
                    <option key={transmision} value={transmision}>{transmision}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Kilometraje */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kilometraje máx</label>
              <input
                type="number"
                value={filters.kilometrajeMax}
                onChange={(e) => handleFilterChange('kilometrajeMax', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="200000"
              />
            </div>

            {/* Botón limpiar */}
            <button
              onClick={clearFilters}
              className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar filtros
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}