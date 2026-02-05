import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendChatMessage } from '@/lib/openrouter'

export async function POST(request: NextRequest) {
  try {
    const { message, agentId, apiKey } = await request.json()

    if (!message || !agentId || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get agent details
    const supabase = createClient()
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single()

    if (agentError || !agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Get chat history
    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: true })
      .limit(10)

    // Build messages array
    const messages = [
      { role: 'system' as const, content: agent.system_prompt },
      ...(history || []).map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ]

    // Call OpenRouter
    const response = await sendChatMessage(apiKey, {
      model: agent.model,
      messages,
      temperature: agent.temperature,
      max_tokens: agent.max_tokens,
    })

    return NextResponse.json({
      response: response.choices[0].message.content,
      usage: response.usage,
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
