'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import AgentForm from '@/components/AgentForm'
import { CreateAgentInput } from '@/types/agent'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateAgentPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (data: CreateAgentInput) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('agents').insert({
      user_id: user.id,
      name: data.name,
      description: data.description || null,
      system_prompt: data.system_prompt,
      model: data.model,
      temperature: data.temperature || 0.7,
      max_tokens: data.max_tokens || 1000,
    })

    if (!error) {
      router.push('/agents')
    } else {
      alert('Erro ao criar agente: ' + error.message)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/agents"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar para agentes</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Criar Novo Agente</h1>
            <p className="text-gray-600 mt-2">
              Configure seu agente de IA personalizado
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <AgentForm onSubmit={handleSubmit} submitLabel="Criar Agente" />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
