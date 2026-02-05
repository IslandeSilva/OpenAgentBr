import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Fetch models from database
    const { data: models, error: modelsError } = await supabase
      .from('available_models')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true })

    if (modelsError) {
      console.error('Error fetching models:', modelsError)
      return NextResponse.json(
        { error: 'Erro ao buscar modelos' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      models: models || [],
      count: models?.length || 0,
    })
  } catch (error: any) {
    console.error('Models API error:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
