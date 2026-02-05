'use client'

import { useState } from 'react'
import { CreateAgentInput } from '@/types/agent'
import ModelSelect from './ModelSelect'

interface AgentFormProps {
  initialData?: CreateAgentInput
  onSubmit: (data: CreateAgentInput) => Promise<void>
  submitLabel?: string
}

export default function AgentForm({
  initialData,
  onSubmit,
  submitLabel = 'Criar Agente',
}: AgentFormProps) {
  const [formData, setFormData] = useState<CreateAgentInput>(
    initialData || {
      name: '',
      description: '',
      system_prompt: '',
      model: '',
      temperature: 0.7,
      max_tokens: 1000,
    }
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Agente *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: Assistente de Vendas"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Descreva o propósito deste agente..."
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="system_prompt" className="block text-sm font-medium text-gray-700 mb-1">
          System Prompt *
        </label>
        <textarea
          id="system_prompt"
          value={formData.system_prompt}
          onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          placeholder="Você é um assistente útil que..."
          rows={6}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Define o comportamento e personalidade do agente
        </p>
      </div>

      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
          Modelo *
        </label>
        <ModelSelect
          value={formData.model}
          onChange={(modelId) => setFormData({ ...formData, model: modelId })}
          showPricing={true}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
            Temperatura
          </label>
          <input
            id="temperature"
            type="number"
            min="0"
            max="2"
            step="0.1"
            value={formData.temperature}
            onChange={(e) =>
              setFormData({ ...formData, temperature: parseFloat(e.target.value) })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">0 = Determinístico, 2 = Criativo</p>
        </div>

        <div>
          <label htmlFor="max_tokens" className="block text-sm font-medium text-gray-700 mb-1">
            Max Tokens
          </label>
          <input
            id="max_tokens"
            type="number"
            min="100"
            max="4000"
            step="100"
            value={formData.max_tokens}
            onChange={(e) =>
              setFormData({ ...formData, max_tokens: parseInt(e.target.value) })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">Limite de tokens na resposta</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Salvando...' : submitLabel}
      </button>
    </form>
  )
}
