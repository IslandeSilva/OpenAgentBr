'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import ConversationSidebar from '@/components/ConversationSidebar'
import { Agent } from '@/types/agent'
import { ArrowLeft, Edit, Send, Bot, User, Paperclip, X } from 'lucide-react'
import FileUpload from '@/components/FileUpload'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  tokens_used?: number
  cost?: number
  created_at: string
}

interface UploadedFile {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  publicUrl: string
}

export default function AgentChatPage() {
  const params = useParams()
  const router = useRouter()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [conversationStats, setConversationStats] = useState({ tokens: 0, cost: 0 })
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

  const loadConversation = useCallback(async (conversationId: string) => {
    setCurrentConversationId(conversationId)
    setMessages([])
    
    // Fetch messages for this conversation
    const { data: msgs, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (!error && msgs) {
      setMessages(msgs)
    }

    // Fetch conversation stats
    const { data: conv } = await supabase
      .from('conversations')
      .select('total_tokens, total_cost')
      .eq('id', conversationId)
      .single()

    if (conv) {
      setConversationStats({
        tokens: conv.total_tokens || 0,
        cost: conv.total_cost || 0,
      })
    }
  }, [supabase])

  const startNewConversation = useCallback(() => {
    setCurrentConversationId(null)
    setMessages([])
    setConversationStats({ tokens: 0, cost: 0 })
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!input.trim() && attachedFiles.length === 0) || sending || !agent) return

    const userMessage = input.trim()
    const filesToSend = [...attachedFiles]
    
    setInput('')
    setAttachedFiles([])
    setShowFileUpload(false)
    setSending(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

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
      let messageContent = userMessage
      if (filesToSend && filesToSend.length > 0) {
        const imageFiles = filesToSend.filter((f: any) => f.fileType.startsWith('image/'))
        if (imageFiles.length > 0) {
          messageContent = userMessage + '\n\n[Imagens anexadas: ' + imageFiles.map((f: any) => f.publicUrl).join(', ') + ']'
        }
      }

      // Add user message to UI immediately
      const tempUserMsg: Message = {
        id: 'temp-user-' + Date.now(),
        role: 'user',
        content: userMessage || '[Arquivo(s) anexado(s)]',
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, tempUserMsg])

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
          conversationId: currentConversationId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send message')
      }

      const data = await response.json()

      // Update conversation ID if this was a new conversation
      if (!currentConversationId && data.conversationId) {
        setCurrentConversationId(data.conversationId)
      }

      // Reload conversation to get all messages with proper IDs
      if (data.conversationId) {
        await loadConversation(data.conversationId)
      }

      // Update stats
      if (data.usage) {
        setConversationStats(prev => ({
          tokens: prev.tokens + (data.usage.tokens || 0),
          cost: prev.cost + parseFloat(data.usage.cost || 0),
        }))
      }
    } catch (error: any) {
      console.error('Error sending message:', error)
      setMessages(prev => [
        ...prev,
        {
          id: 'error-' + Date.now(),
          role: 'assistant',
          content: error.message || 'Desculpe, ocorreu um erro ao processar sua mensagem.',
          created_at: new Date().toISOString(),
        },
      ])
    } finally {
      setSending(false)
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

  if (!agent) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Conversation Sidebar */}
          <ConversationSidebar
            agentId={agent.id}
            currentConversationId={currentConversationId}
            onSelectConversation={loadConversation}
            onNewConversation={startNewConversation}
          />

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="border-b bg-white px-4 sm:px-6 lg:px-8 py-4">
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
                <div className="flex items-center space-x-4">
                  <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                    <span>🔢 {conversationStats.tokens} tokens</span>
                    <span>💰 ${conversationStats.cost.toFixed(4)}</span>
                  </div>
                  <Link
                    href={`/agents/${params.id}/edit`}
                    className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="hidden sm:inline">Editar</span>
                  </Link>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {agent.model}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Inicie uma conversa com {agent.name}
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bot className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-2xl px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))
              )}
              {sending && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t bg-white p-4">
              {showFileUpload && (
                <div className="max-w-4xl mx-auto mb-4">
                  <FileUpload
                    onUpload={setAttachedFiles}
                    maxFiles={5}
                    disabled={sending}
                  />
                </div>
              )}

              {attachedFiles.length > 0 && !showFileUpload && (
                <div className="max-w-4xl mx-auto mb-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Paperclip className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-900">
                        {attachedFiles.length} arquivo(s) anexado(s)
                      </span>
                    </div>
                    <button
                      onClick={() => setAttachedFiles([])}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowFileUpload(!showFileUpload)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      showFileUpload || attachedFiles.length > 0
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    disabled={sending}
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || (!input.trim() && attachedFiles.length === 0)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
