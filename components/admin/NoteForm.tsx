'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import FileUploader from './FileUploader'

interface NoteFormProps {
    subjectId: string
    onSuccess: () => void
    initialData?: any
}

export default function NoteForm({ subjectId, onSuccess, initialData }: NoteFormProps) {
    const [title, setTitle] = useState(initialData?.title || '')
    const [description, setDescription] = useState(initialData?.description || '')
    const [pdfUrls, setPdfUrls] = useState<string[]>(initialData?.pdf_urls || [])
    const [imageUrls, setImageUrls] = useState<string[]>(initialData?.image_urls || [])
    const [materialUrls, setMaterialUrls] = useState<any[]>(initialData?.material_urls || [])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const addMaterialUrl = () => {
        setMaterialUrls([...materialUrls, { title: '', url: '' }])
    }

    const updateMaterialUrl = (index: number, field: 'title' | 'url', value: string) => {
        const newUrls = [...materialUrls]
        newUrls[index][field] = value
        setMaterialUrls(newUrls)
    }

    const removeMaterialUrl = (index: number) => {
        setMaterialUrls(materialUrls.filter((_, i) => i !== index))
    }

    const removePdf = (index: number) => {
        setPdfUrls(pdfUrls.filter((_, i) => i !== index))
    }

    const removeImage = (index: number) => {
        setImageUrls(imageUrls.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = {
                subject_id: subjectId,
                title,
                description,
                pdf_urls: pdfUrls,
                image_urls: imageUrls,
                material_urls: materialUrls
            }

            if (initialData) {
                await supabase.from('notes').update(data).eq('id', initialData.id)
            } else {
                await supabase.from('notes').insert([data])
            }

            router.refresh()
            onSuccess()
        } catch (error) {
            console.error('Error saving note:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm"
                    />
                </div>
            </div>

            <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">PDF Documents</h3>
                </div>

                <FileUploader
                    bucket="classroom_assets"
                    path={`notes/${subjectId}/pdfs`}
                    label="Upload PDF"
                    accept=".pdf"
                    onUploadComplete={(url) => setPdfUrls([...pdfUrls, url])}
                />

                {pdfUrls.length > 0 && (
                    <div className="space-y-2">
                        {pdfUrls.map((url, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                <p className="text-xs text-slate-600 dark:text-slate-300 truncate flex-1">
                                    PDF {index + 1}: {url.split('/').pop()}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => removePdf(index)}
                                    className="ml-2 text-red-500 hover:text-red-600"
                                >
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center mt-6">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">Images</h3>
                </div>

                <FileUploader
                    bucket="classroom_assets"
                    path={`notes/${subjectId}/images`}
                    label="Upload Image"
                    accept="image/*"
                    onUploadComplete={(url) => setImageUrls([...imageUrls, url])}
                />

                {imageUrls.length > 0 && (
                    <div className="space-y-2">
                        {imageUrls.map((url, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                <p className="text-xs text-slate-600 dark:text-slate-300 truncate flex-1">
                                    Image {index + 1}: {url.split('/').pop()}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="ml-2 text-red-500 hover:text-red-600"
                                >
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">Additional Resources / Documentation</h3>
                    <button
                        type="button"
                        onClick={addMaterialUrl}
                        className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400"
                    >
                        + Add Link
                    </button>
                </div>

                {materialUrls.map((material, index) => (
                    <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                            <input
                                type="text"
                                placeholder="Title"
                                value={material.title}
                                onChange={(e) => updateMaterialUrl(index, 'title', e.target.value)}
                                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-xs"
                            />
                            <input
                                type="url"
                                placeholder="URL"
                                value={material.url}
                                onChange={(e) => updateMaterialUrl(index, 'url', e.target.value)}
                                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-xs"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeMaterialUrl(index)}
                            className="text-red-500 hover:text-red-600"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <button
                    type="button"
                    onClick={onSuccess}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    )
}
