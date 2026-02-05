'use client'

import { X } from 'lucide-react'
import Image from 'next/image'

interface FilePreviewProps {
  fileName: string
  fileType: string
  publicUrl: string
  onRemove?: () => void
}

export default function FilePreview({
  fileName,
  fileType,
  publicUrl,
  onRemove,
}: FilePreviewProps) {
  const isImage = fileType.startsWith('image/')

  return (
    <div className="relative group">
      {isImage ? (
        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
          <Image
            src={publicUrl}
            alt={fileName}
            fill
            className="object-cover"
          />
          {onRemove && (
            <button
              onClick={onRemove}
              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ) : (
        <div className="w-24 h-24 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center relative">
          <div className="text-center">
            <p className="text-xs text-gray-600 font-medium truncate px-2">
              {fileName.split('.').pop()?.toUpperCase()}
            </p>
          </div>
          {onRemove && (
            <button
              onClick={onRemove}
              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
      <p className="text-xs text-gray-600 mt-1 truncate w-24" title={fileName}>
        {fileName}
      </p>
    </div>
  )
}
