'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Sparkles, Eye, Zap } from 'lucide-react'

interface Model {
  id: string
  model_id: string
  name: string
  provider: string
  pricing: {
    prompt: number
    completion: number
  }
  context_length: number
  supports_vision: boolean
  supports_function_calling: boolean
}

interface ModelSelectProps {
  value: string
  onChange: (modelId: string) => void
  showPricing?: boolean
  filterVision?: boolean
}

export default function ModelSelect({
  value,
  onChange,
  showPricing = true,
  filterVision = false,
}: ModelSelectProps) {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('available_models')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true })

      if (!error && data) {
        setModels(data)
      }
    } catch (error) {
      console.error('Error fetching models:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(search.toLowerCase()) ||
      model.model_id.toLowerCase().includes(search.toLowerCase()) ||
      model.provider.toLowerCase().includes(search.toLowerCase())

    const matchesVision = !filterVision || model.supports_vision

    return matchesSearch && matchesVision
  })

  const selectedModel = models.find((m) => m.model_id === value)

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free'
    if (price < 0.001) return `$${(price * 1000000).toFixed(2)}/1M`
    if (price < 1) return `$${(price * 1000).toFixed(2)}/1K`
    return `$${price.toFixed(2)}`
  }

  const formatContext = (length: number) => {
    if (length >= 1000000) return `${(length / 1000000).toFixed(1)}M`
    if (length >= 1000) return `${(length / 1000).toFixed(0)}K`
    return length.toString()
  }

  if (loading) {
    return (
      <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
        <p className="text-gray-500">Carregando modelos...</p>
      </div>
    )
  }

  if (models.length === 0) {
    return (
      <div className="w-full">
        <div className="px-4 py-3 border border-orange-300 rounded-lg bg-orange-50">
          <p className="text-orange-800 text-sm font-medium">
            Nenhum modelo disponível
          </p>
          <p className="text-orange-600 text-xs mt-1">
            Configure sua API Key nas{' '}
            <a href="/settings" className="underline font-medium">
              Configurações
            </a>{' '}
            para carregar os modelos.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar modelo..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Selected Model Display */}
      {selectedModel && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-blue-900">{selectedModel.name}</h4>
                {selectedModel.supports_vision && (
                  <Eye className="h-4 w-4 text-blue-600" title="Suporta visão" />
                )}
                {selectedModel.supports_function_calling && (
                  <Zap className="h-4 w-4 text-blue-600" title="Suporta function calling" />
                )}
              </div>
              <div className="flex items-center space-x-3 mt-1 text-xs text-blue-700">
                <span className="font-medium">{selectedModel.provider}</span>
                {showPricing && (
                  <>
                    <span>•</span>
                    <span>
                      {formatPrice(selectedModel.pricing.prompt)} prompt
                    </span>
                    <span>•</span>
                    <span>
                      {formatContext(selectedModel.context_length)} tokens
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model Selector */}
      <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
        {filteredModels.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            Nenhum modelo encontrado
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredModels.map((model) => (
              <button
                key={model.id}
                onClick={() => onChange(model.model_id)}
                className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${
                  value === model.model_id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4
                        className={`font-medium truncate ${
                          value === model.model_id
                            ? 'text-blue-900'
                            : 'text-gray-900'
                        }`}
                      >
                        {model.name}
                      </h4>
                      {model.supports_vision && (
                        <Eye className="h-4 w-4 text-gray-600 flex-shrink-0" title="Suporta visão" />
                      )}
                      {model.supports_function_calling && (
                        <Zap className="h-4 w-4 text-gray-600 flex-shrink-0" title="Suporta function calling" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-gray-600">
                      <span className="font-medium">{model.provider}</span>
                      {showPricing && (
                        <>
                          <span>•</span>
                          <span>
                            {formatPrice(model.pricing.prompt)}/1K prompt
                          </span>
                          <span>•</span>
                          <span>
                            {formatContext(model.context_length)} ctx
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {value === model.model_id && (
                    <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 ml-2" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        {filteredModels.length} modelo(s) disponível(is)
      </p>
    </div>
  )
}
