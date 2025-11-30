'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface SubjectFormProps {
    onSuccess: () => void
    initialData?: any
}

export default function SubjectForm({ onSuccess, initialData }: SubjectFormProps) {
    const [title, setTitle] = useState(initialData?.title || '')
    const [iconName, setIconName] = useState(initialData?.icon_name || 'book')
    const [colorTheme, setColorTheme] = useState(initialData?.color_theme || {
        bg: 'bg-blue-100',
        text: 'text-blue-500',
        darkBg: 'dark:bg-blue-900/50',
        darkText: 'dark:text-blue-400'
    })
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = {
                title,
                icon_name: iconName,
                color_theme: colorTheme
            }

            if (initialData) {
                await supabase.from('subjects').update(data).eq('id', initialData.id)
            } else {
                await supabase.from('subjects').insert([data])
            }

            router.refresh()
            onSuccess()
        } catch (error) {
            console.error('Error saving subject:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Icon Name (Material Symbol)</label>
                <input
                    type="text"
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm"
                />
            </div>
            <div className="flex justify-end gap-2">
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
