'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import { Check, X, Key, RefreshCw, Loader2, DollarSign, Database } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [refreshingModels, setRefreshingModels] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [credits, setCredits] = useState<{
    total: number
    used: number
    remaining: number
  } | null>(null)
  
  const [modelsCount, setModelsCount] = useState(0)
  const [lastSync, setLastSync] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: settings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (settings) {
        setApiKey(settings.openrouter_api_key || '')
        if (settings.credits_total !== null) {
          setCredits({
            total: settings.credits_total || 0,
            used: settings.credits_used || 0,
            remaining: (settings.credits_total || 0) - (settings.credits_used || 0),
          })
        }
        setLastSync(settings.last_sync)
      }

      // Get models count
      const { data: models } = await supabase
        .from('available_models')
        .select('id')
        .eq('user_id', user.id)

      setModelsCount(models?.length || 0)
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleValidateAndSave = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'Por favor, insira uma API Key' })
      return
    }

    setValidating(true)
    setMessage(null)

    try {
      const response = await fetch('/api/openrouter/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Erro ao validar API Key' })
        return
      }

      setCredits(data.credits)
      setModelsCount(data.modelsCount || 0)
      setLastSync(new Date().toISOString())
      setMessage({
        type: 'success',
        text: `API Key validada com sucesso! ${data.modelsCount} modelos carregados.`,
      })
    } catch (error: any) {
      console.error('Validation error:', error)
      setMessage({ type: 'error', text: 'Erro ao validar API Key' })
    } finally {
      setValidating(false)
    }
  }

  const handleRefreshModels = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'Configure uma API Key primeiro' })
      return
    }

    setRefreshingModels(true)
    setMessage(null)

    try {
      const response = await fetch('/api/openrouter/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Erro ao atualizar modelos' })
        return
      }

      setModelsCount(data.modelsCount || 0)
      setCredits(data.credits)
      setLastSync(new Date().toISOString())
      setMessage({
        type: 'success',
        text: `Lista de modelos atualizada! ${data.modelsCount} modelos disponíveis.`,
      })
    } catch (error: any) {
      console.error('Refresh error:', error)
      setMessage({ type: 'error', text: 'Erro ao atualizar modelos' })
    } finally {
      setRefreshingModels(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600 mt-2">
              Configure sua API Key do OpenRouter e gerencie seus modelos de IA
            </p>
          </div>

          {/* Message Alert */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <X className="h-5 w-5 text-red-600" />
              )}
              <p>{message.text}</p>
            </div>
          )}

          {/* API Key Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Key className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">API Key do OpenRouter</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                  Sua API Key
                </label>
                <input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Obtenha sua API Key em{' '}
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    openrouter.ai/keys
                  </a>
                </p>
              </div>

              <button
                onClick={handleValidateAndSave}
                disabled={validating || !apiKey.trim()}
                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {validating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Validando...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Validar e Salvar API Key</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Credits Section */}
          {credits && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="h-5 w-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Créditos</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">Total</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ${credits.total.toFixed(2)}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-orange-600 font-medium">Usado</p>
                  <p className="text-2xl font-bold text-orange-900">
                    ${credits.used.toFixed(2)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">Disponível</p>
                  <p className="text-2xl font-bold text-green-900">
                    ${credits.remaining.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Models Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Modelos Disponíveis</h2>
              </div>
              <button
                onClick={handleRefreshModels}
                disabled={refreshingModels || !apiKey.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {refreshingModels ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span>Atualizar Lista</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-700">Total de modelos carregados</span>
                <span className="text-2xl font-bold text-blue-600">{modelsCount}</span>
              </div>
              
              {lastSync && (
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-700">Última sincronização</span>
                  <span className="text-sm text-gray-600">
                    {new Date(lastSync).toLocaleString('pt-BR')}
                  </span>
                </div>
              )}

              {modelsCount === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Database className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>Nenhum modelo carregado ainda.</p>
                  <p className="text-sm mt-1">
                    Configure sua API Key e clique em &quot;Validar e Salvar&quot; para carregar os modelos.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
