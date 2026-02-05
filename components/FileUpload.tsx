'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2, File, Image as ImageIcon } from 'lucide-react'

interface UploadedFile {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  publicUrl: string
}

interface FileUploadProps {
  onUpload: (files: UploadedFile[]) => void
  maxFiles?: number
  disabled?: boolean
}

export default function FileUpload({
  onUpload,
  maxFiles = 5,
  disabled = false,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (fileList: FileList) => {
    setError(null)

    if (files.length + fileList.length > maxFiles) {
      setError(`Máximo de ${maxFiles} arquivos permitidos`)
      return
    }

    setUploading(true)
    const uploadedFiles: UploadedFile[] = []

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Erro ao fazer upload')
        }

        const data = await response.json()
        uploadedFiles.push(data)
      }

      const newFiles = [...files, ...uploadedFiles]
      setFiles(newFiles)
      onUpload(newFiles)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Erro ao fazer upload dos arquivos')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (disabled || uploading) return

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files)
      }
    },
    [disabled, uploading, files]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files)
    }
  }

  const handleRemoveFile = async (fileId: string) => {
    try {
      await fetch(`/api/upload?id=${fileId}`, {
        method: 'DELETE',
      })

      const newFiles = files.filter((f) => f.id !== fileId)
      setFiles(newFiles)
      onUpload(newFiles)
    } catch (err) {
      console.error('Error removing file:', err)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const isImage = (fileType: string) => {
    return fileType.startsWith('image/')
  }

  return (
    <div className="w-full space-y-3">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        } ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          disabled={disabled || uploading}
          className="hidden"
          accept="image/*,.pdf,.txt,.md,.csv"
        />

        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600">Fazendo upload...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Clique para selecionar ou arraste arquivos aqui
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF, WebP, PDF, TXT, MD, CSV (máx. 10MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Arquivos anexados ({files.length}/{maxFiles})
          </p>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg"
              >
                {isImage(file.fileType) ? (
                  <ImageIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <File className="h-5 w-5 text-gray-600 flex-shrink-0" />
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.fileName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.fileSize)}
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveFile(file.id)}
                  disabled={disabled || uploading}
                  className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
