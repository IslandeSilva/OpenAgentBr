'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, DollarSign, Zap, CreditCard } from 'lucide-react'

interface UsageMetricsProps {
  apiKey?: string
}

export default function UsageMetrics({ apiKey }: UsageMetricsProps) {
  const [usage, setUsage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (apiKey) {
      fetchUsage()
    }
  }, [apiKey])

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/usage')
      if (!response.ok) {
        throw new Error('Failed to fetch usage data')
      }
      const data = await response.json()
      setUsage(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error || !usage) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Métricas de Uso</h2>
        <p className="text-gray-600">
          {error || 'Configure sua API key do OpenRouter para ver métricas'}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Métricas de Uso</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <MetricCard
          icon={<CreditCard className="h-6 w-6 text-blue-600" />}
          label="Créditos Disponíveis"
          value={usage.data?.label || 'N/A'}
          bgColor="bg-blue-50"
        />
        <MetricCard
          icon={<Zap className="h-6 w-6 text-yellow-600" />}
          label="Uso Total"
          value={usage.data?.usage?.toString() || '0'}
          bgColor="bg-yellow-50"
        />
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-500">
          Dados atualizados do OpenRouter API
        </p>
      </div>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ReactNode
  label: string
  value: string
  bgColor: string
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className={`inline-flex p-2 rounded-lg ${bgColor} mb-2`}>{icon}</div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
