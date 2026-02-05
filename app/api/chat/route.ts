import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendChatMessage } from '@/lib/openrouter'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { message, agentId, apiKey, conversationId } = await request.json()

    if (!message || !agentId || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get agent details
    const supabase = createClient()
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .eq('user_id', user.id)
      .single()

    if (agentError || !agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Manage conversation
    let currentConversationId = conversationId

    if (!currentConversationId) {
      // Create new conversation
      const titleText = message.length > 50 ? message.substring(0, 50) + '...' : message
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          agent_id: agentId,
          title: titleText,
        })
        .select()
        .single()

      if (convError) {
        console.error('Error creating conversation:', convError)
        return NextResponse.json(
          { error: 'Failed to create conversation' },
          { status: 500 }
        )
      }

      currentConversationId = newConv.id
    }

    // Check message limit (100 messages per conversation)
    const { count, error: countError } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', currentConversationId)

    if (countError) {
      console.error('Error counting messages:', countError)
    }

    if (count && count >= 100) {
      return NextResponse.json(
        { error: 'Limite de 100 mensagens atingido. Inicie uma nova conversa.' },
        { status: 400 }
      )
    }

    // Get chat history (last 20 messages)
    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: true })
      .limit(20)

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

    const aiMessage = response.choices[0].message.content
    const tokensUsed = response.usage?.total_tokens || 0
    const promptTokens = response.usage?.prompt_tokens || 0
    const completionTokens = response.usage?.completion_tokens || 0

    // Calculate cost (get pricing from available_models or use defaults)
    const { data: modelInfo } = await supabase
      .from('available_models')
      .select('pricing')
      .eq('user_id', user.id)
      .eq('model_id', agent.model)
      .single()

    let cost = 0
    if (modelInfo && modelInfo.pricing) {
      const pricing = modelInfo.pricing as { prompt: number; completion: number }
      cost = (promptTokens / 1000000 * pricing.prompt) + (completionTokens / 1000000 * pricing.completion)
    }

    // Save messages with tokens and cost
    await supabase.from('chat_messages').insert([
      {
        user_id: user.id,
        agent_id: agentId,
        conversation_id: currentConversationId,
        role: 'user',
        content: message,
        tokens_used: 0,
        cost: 0,
      },
      {
        user_id: user.id,
        agent_id: agentId,
        conversation_id: currentConversationId,
        role: 'assistant',
        content: aiMessage,
        tokens_used: tokensUsed,
        cost,
      },
    ])

    return NextResponse.json({
      response: aiMessage,
      conversationId: currentConversationId,
      usage: {
        tokens: tokensUsed,
        cost: cost.toFixed(6),
      },
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
