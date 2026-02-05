import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/markdown',
  'text/csv',
]

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const messageId = formData.get('messageId') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo fornecido' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 10MB' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo de arquivo não permitido. Tipos aceitos: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    // Create unique file path
    const timestamp = Date.now()
    const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `${user.id}/${timestamp}_${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('chat-files')
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Erro ao fazer upload do arquivo' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('chat-files')
      .getPublicUrl(uploadData.path)

    // Save file metadata to database
    const { data: fileRecord, error: dbError } = await supabase
      .from('file_uploads')
      .insert({
        user_id: user.id,
        message_id: messageId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: uploadData.path,
        public_url: urlData.publicUrl,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Clean up uploaded file
      await supabase.storage.from('chat-files').remove([uploadData.path])
      return NextResponse.json(
        { error: 'Erro ao salvar metadados do arquivo' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      id: fileRecord.id,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      publicUrl: urlData.publicUrl,
      storagePath: uploadData.path,
    })
  } catch (error: any) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('id')

    if (!fileId) {
      return NextResponse.json(
        { error: 'ID do arquivo é obrigatório' },
        { status: 400 }
      )
    }

    // Get file info
    const { data: fileInfo, error: fetchError } = await supabase
      .from('file_uploads')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !fileInfo) {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      )
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('chat-files')
      .remove([fileInfo.storage_path])

    if (storageError) {
      console.error('Storage delete error:', storageError)
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('file_uploads')
      .delete()
      .eq('id', fileId)
      .eq('user_id', user.id)

    if (dbError) {
      return NextResponse.json(
        { error: 'Erro ao deletar arquivo' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete API error:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
