'use client'

import { Agent } from '@/types/agent'
import { Bot, Edit, Trash2, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface AgentCardProps {
  agent: Agent
  onDelete?: (id: string) => void
}

export default function AgentCard({ agent, onDelete }: AgentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{agent.name}</h3>
            <p className="text-sm text-gray-500">
              Criado em {formatDate(agent.created_at)}
            </p>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {agent.description || 'Sem descrição'}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
          {agent.model}
        </span>
        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
          Temp: {agent.temperature}
        </span>
        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
          Max tokens: {agent.max_tokens}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <Link
          href={`/agents/${agent.id}`}
          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Chat</span>
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(agent.id)}
            className="px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
