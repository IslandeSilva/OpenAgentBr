'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import { Agent } from '@/types/agent'
import { Bot, Plus, TrendingUp, Zap, DollarSign } from 'lucide-react'

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchAgents = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (data && !error) {
      setAgents(data)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Gerencie seus agentes e acompanhe métricas</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Bot className="h-6 w-6 text-blue-600" />}
              label="Total de Agentes"
              value={agents.length.toString()}
              bgColor="bg-blue-50"
            />
            <StatCard
              icon={<Zap className="h-6 w-6 text-yellow-600" />}
              label="Mensagens Hoje"
              value="0"
              bgColor="bg-yellow-50"
            />
            <StatCard
              icon={<TrendingUp className="h-6 w-6 text-green-600" />}
              label="Créditos Usados"
              value="0"
              bgColor="bg-green-50"
            />
            <StatCard
              icon={<DollarSign className="h-6 w-6 text-purple-600" />}
              label="Custo Total"
              value="R$ 0,00"
              bgColor="bg-purple-50"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/agents/create"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
                <span>Criar Novo Agente</span>
              </Link>
              <Link
                href="/agents"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Bot className="h-5 w-5" />
                <span>Ver Todos os Agentes</span>
              </Link>
            </div>
          </div>

          {/* Recent Agents */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Agentes Recentes</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : agents.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Você ainda não criou nenhum agente</p>
                  <Link
                    href="/agents/create"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Criar Primeiro Agente</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <Link
                      key={agent.id}
                      href={`/agents/${agent.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {agent.description || 'Sem descrição'}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {agent.model}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {agents.length > 0 && (
                    <Link
                      href="/agents"
                      className="block text-center py-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Ver todos os agentes →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

function StatCard({
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
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`inline-flex p-3 rounded-lg ${bgColor} mb-4`}>{icon}</div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
