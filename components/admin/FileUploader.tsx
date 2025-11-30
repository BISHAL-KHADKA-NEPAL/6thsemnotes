'use client'

import { useState, useRef } from 'react'
import { uploadFile, getPublicUrl } from '@/utils/supabase/storage'

interface FileUploaderProps {
    bucket: string
    path: string
    onUploadComplete: (url: string) => void
    accept?: string
    label: string
}

export default function FileUploader({
    bucket,
    path,
    onUploadComplete,
    accept = '*',
    label,
}: FileUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }

        const file = e.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${path}/${fileName}`

        setUploading(true)
        setError(null)

        try {
            await uploadFile(bucket, filePath, file)
            const url = getPublicUrl(bucket, filePath)
            onUploadComplete(url)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
            </label>
            <div className="flex items-center gap-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    accept={accept}
                    onChange={handleUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            dark:file:bg-blue-900/20 dark:file:text-blue-400
          "
                />
                {uploading && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                )}
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    )
}
