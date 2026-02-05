import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateApiKey, fetchAvailableModels, isValidOpenRouterKey, OpenRouterModel } from '@/lib/openrouter'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key é obrigatória' },
        { status: 400 }
      )
    }

    // Validate format
    if (!isValidOpenRouterKey(apiKey)) {
      return NextResponse.json(
        { error: 'Formato de API Key inválido. Deve começar com sk-or-v1-' },
        { status: 400 }
      )
    }

    // Validate with OpenRouter
    const validation = await validateApiKey(apiKey)
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'API Key inválida' },
        { status: 401 }
      )
    }

    // Fetch available models
    let models: Array<{
      model_id: string
      name: string
      provider: string
      pricing: { prompt: number; completion: number }
      context_length: number
      supports_vision: boolean
      supports_function_calling: boolean
    }> = []
    try {
      const allModels: OpenRouterModel[] = await fetchAvailableModels(apiKey)
      models = allModels.map((model: OpenRouterModel) => ({
        model_id: model.id,
        name: model.name || model.id,
        provider: model.id.split('/')[0] || 'unknown',
        pricing: {
          prompt: parseFloat(model.pricing?.prompt || '0'),
          completion: parseFloat(model.pricing?.completion || '0'),
        },
        context_length: model.context_length || model.top_provider?.context_length || 0,
        supports_vision: model.architecture?.modality === 'multimodal' || model.id.includes('vision'),
        // Note: OpenRouter API doesn't provide a dedicated supports_function_calling field
        // This is based on known model capabilities as of 2024
        supports_function_calling: model.id.includes('gpt-4') || model.id.includes('gpt-3.5'),
      }))
    } catch (error) {
      console.error('Error fetching models:', error)
    }

    // Get authenticated user
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Save API key to user settings
    const { error: settingsError } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        openrouter_api_key: apiKey,
        credits_total: validation.credits?.limit,
        credits_used: validation.credits?.usage,
        last_sync: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })

    if (settingsError) {
      console.error('Error saving settings:', settingsError)
    }

    // Save models to database
    if (models.length > 0) {
      // Delete old models for this user
      await supabase
        .from('available_models')
        .delete()
        .eq('user_id', user.id)

      // Insert new models
      const modelsToInsert = models.map((model: any) => ({
        user_id: user.id,
        ...model,
        updated_at: new Date().toISOString(),
      }))

      const { error: modelsError } = await supabase
        .from('available_models')
        .insert(modelsToInsert)

      if (modelsError) {
        console.error('Error saving models:', modelsError)
      }
    }

    return NextResponse.json({
      valid: true,
      credits: {
        total: validation.credits?.limit || 0,
        used: validation.credits?.usage || 0,
        remaining: (validation.credits?.limit || 0) - (validation.credits?.usage || 0),
      },
      modelsCount: models.length,
    })
  } catch (error: any) {
    console.error('Validate API error:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao validar API Key' },
      { status: 500 }
    )
  }
}
