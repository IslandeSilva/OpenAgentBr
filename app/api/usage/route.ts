import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUsageData } from '@/lib/openrouter'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's OpenRouter API key
    const { data: settings } = await supabase
      .from('user_settings')
      .select('openrouter_api_key')
      .eq('user_id', user.id)
      .single()

    if (!settings?.openrouter_api_key) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 400 }
      )
    }

    // Fetch usage data from OpenRouter
    const usageData = await getUsageData(settings.openrouter_api_key)

    return NextResponse.json(usageData)
  } catch (error: any) {
    console.error('Usage API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
