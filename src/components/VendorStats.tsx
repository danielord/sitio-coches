'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Car, Eye, Heart, TrendingUp, Calendar, Euro, Users, Star } from 'lucide-react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface VendorStatsProps {
  vendedorId: string
}

export default function VendorStats({ vendedorId }: VendorStatsProps) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    loadStats()
  }, [vendedorId, timeRange])

  const loadStats = async () => {
    setLoading(true)
    try {
      // Simular datos de estadísticas
      const mockStats = {
        totalCoches: 12,
        cochesActivos: 10,
        totalVistas: 1250,
        totalFavoritos: 89,
        promedioValoracion: 4.3,
        totalValoraciones: 23,
        ventasEsteMes: 3,
        ingresosTotales: 145000,
        
        // Datos para gráficos
        vistasUltimos30Dias: [
          { fecha: '2024-01-01', vistas: 45 },
          { fecha: '2024-01-02', vistas: 52 },
          { fecha: '2024-01-03', vistas: 38 },
          { fecha: '2024-01-04', vistas: 61 },
          { fecha: '2024-01-05', vistas: 55 },
          { fecha: '2024-01-06', vistas: 48 },
          { fecha: '2024-01-07', vistas: 72 }
        ],
        
        cochesPorMarca: {
          Toyota: 4,
          Ford: 3,
          BMW: 2,
          Mercedes: 2,
          Audi: 1
        },
        
        ventasPorMes: {
          'Ene': 2,
          'Feb': 1,
          'Mar': 3,
          'Abr': 2,
          'May': 4,
          'Jun': 1
        }
      }
      
      setStats(mockStats)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg" />
        ))}
      </div>
    )
  }

  const lineChartData = {
    labels: stats.vistasUltimos30Dias.map((d: any) => 
      new Date(d.fecha).toLocaleDateString('es', { day: 'numeric', month: 'short' })
    ),
    datasets: [
      {
        label: 'Vistas diarias',
        data: stats.vistasUltimos30Dias.map((d: any) => d.vistas),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const barChartData = {
    labels: Object.keys(stats.ventasPorMes),
    datasets: [
      {
        label: 'Ventas por mes',
        data: Object.values(stats.ventasPorMes),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  }

  const doughnutData = {
    labels: Object.keys(stats.cochesPorMarca),
    datasets: [
      {
        data: Object.values(stats.cochesPorMarca),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  return (
    <div className="space-y-6">
      {/* KPIs principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center">
            <Car className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Coches</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCoches}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Vistas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVistas.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Favoritos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFavoritos}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center">
            <Euro className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos</p>
              <p className="text-2xl font-bold text-gray-900">€{stats.ingresosTotales.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Métricas secundarias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valoración Promedio</p>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{stats.promedioValoracion}</span>
                <span className="text-sm text-gray-500">({stats.totalValoraciones})</span>
              </div>
            </div>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ventas Este Mes</p>
              <p className="text-xl font-semibold">{stats.ventasEsteMes}</p>
            </div>
            <Calendar className="h-6 w-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Coches Activos</p>
              <p className="text-xl font-semibold">{stats.cochesActivos}/{stats.totalCoches}</p>
            </div>
            <Users className="h-6 w-6 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vistas en el tiempo */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Vistas Diarias</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
            </select>
          </div>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Ventas por mes */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Ventas por Mes</h3>
          <div className="h-64">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Distribución por marca */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Coches por Marca</h3>
          <div className="h-64">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </div>

        {/* Resumen de rendimiento */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Rendimiento</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tasa de conversión</span>
              <span className="font-semibold">2.4%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tiempo promedio en página</span>
              <span className="font-semibold">3m 24s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Contactos recibidos</span>
              <span className="font-semibold">47</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Precio promedio</span>
              <span className="font-semibold">€{Math.round(stats.ingresosTotales / stats.totalCoches).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}