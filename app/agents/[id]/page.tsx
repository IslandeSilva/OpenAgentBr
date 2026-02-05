'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import ChatInterface from '@/components/ChatInterface'
import { Agent } from '@/types/agent'
import { ArrowLeft, Edit } from 'lucide-react'

export default function AgentChatPage() {
  const params = useParams()
  const router = useRouter()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchAgent()
  }, [params.id])

  const fetchAgent = async () => {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', params.id)
      .single()

    if (data && !error) {
      setAgent(data)
    } else {
      router.push('/agents')
    }
    setLoading(false)
  }

  const handleSendMessage = async (message: string, files?: any[]): Promise<string> => {
    if (!agent) throw new Error('Agent not found')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Save user message
    const { data: userMsg } = await supabase.from('chat_messages').insert({
      user_id: user.id,
      agent_id: agent.id,
      role: 'user',
      content: message || '[Arquivo(s) anexado(s)]',
    }).select().single()

    // If files are attached, link them to the message
    if (files && files.length > 0 && userMsg) {
      const fileUpdates = files.map((file: any) => ({
        id: file.id,
        message_id: userMsg.id,
      }))
      
      for (const fileUpdate of fileUpdates) {
        await supabase
          .from('file_uploads')
          .update({ message_id: fileUpdate.message_id })
          .eq('id', fileUpdate.id)
      }
    }

    // Get user's OpenRouter API key
    const { data: settings } = await supabase
      .from('user_settings')
      .select('openrouter_api_key')
      .eq('user_id', user.id)
      .single()

    if (!settings?.openrouter_api_key) {
      throw new Error('Configure sua API key do OpenRouter nas configurações')
    }

    // Prepare message content with files for vision models
    let messageContent = message
    if (files && files.length > 0) {
      const imageFiles = files.filter((f: any) => f.fileType.startsWith('image/'))
      if (imageFiles.length > 0) {
        messageContent = message + '\n\n[Imagens anexadas: ' + imageFiles.map((f: any) => f.publicUrl).join(', ') + ']'
      }
    }

    // Call API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: messageContent,
        agentId: agent.id,
        apiKey: settings.openrouter_api_key,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to send message')
    }

    const data = await response.json()

    // Save assistant message
    await supabase.from('chat_messages').insert({
      user_id: user.id,
      agent_id: agent.id,
      role: 'assistant',
      content: data.response,
    })

    return data.response
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

  if (!agent) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/agents"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{agent.name}</h1>
                  <p className="text-sm text-gray-600">{agent.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  href={`/agents/${params.id}/edit`}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4" />
                  <span>Editar</span>
                </Link>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {agent.model}
                </span>
              </div>
            </div>
          </div>
        </div>

        <ChatInterface
          agentId={agent.id}
          agentName={agent.name}
          onSendMessage={handleSendMessage}
        />
      </div>
    </ProtectedRoute>
  )
}
