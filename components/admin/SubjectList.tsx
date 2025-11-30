'use client'

import { useState } from 'react'
import Link from 'next/link'
import Modal from './Modal'
import SubjectForm from './SubjectForm'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function SubjectList({ subjects }: { subjects: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingSubject, setEditingSubject] = useState<any>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this subject?')) return

        await supabase.from('subjects').delete().eq('id', id)
        router.refresh()
    }

    const toggleVisibility = async (id: string, currentlyHidden: boolean) => {
        await supabase
            .from('subjects')
            .update({ is_hidden: !currentlyHidden })
            .eq('id', id)
        router.refresh()
    }

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Admin Dashboard
                </h1>
                <div className="flex gap-4">
                    <Link
                        href="/"
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
                    >
                        View Site
                    </Link>
                    <button
                        onClick={() => {
                            setEditingSubject(null)
                            setIsModalOpen(true)
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500"
                    >
                        Add Subject
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects?.map((subject) => (
                    <div
                        key={subject.id}
                        className="group relative block p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    toggleVisibility(subject.id, subject.is_hidden)
                                }}
                                className={`p-1 ${subject.is_hidden ? 'text-slate-400 hover:text-green-600' : 'text-blue-600 hover:text-slate-400'}`}
                                title={subject.is_hidden ? 'Show subject' : 'Hide subject'}
                            >
                                <span className="material-symbols-outlined text-lg">
                                    {subject.is_hidden ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    setEditingSubject(subject)
                                    setIsModalOpen(true)
                                }}
                                className="p-1 text-slate-400 hover:text-blue-600"
                            >
                                <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleDelete(subject.id)
                                }}
                                className="p-1 text-slate-400 hover:text-red-600"
                            >
                                <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                        </div>
                        <Link href={`/admin/subjects/${subject.id}`} className="flex items-center gap-4">
                            <div
                                className={`flex items-center justify-center size-12 rounded-full ${subject.color_theme?.bg || 'bg-gray-100'} ${subject.color_theme?.text || 'text-gray-500'} ${subject.is_hidden ? 'opacity-50' : ''}`}
                            >
                                <span className="material-symbols-outlined text-2xl">
                                    {subject.icon_name}
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className={`text-lg font-semibold text-slate-900 dark:text-white ${subject.is_hidden ? 'opacity-50' : ''}`}>
                                        {subject.title}
                                    </h3>
                                    {subject.is_hidden && (
                                        <span className="px-2 py-0.5 text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded">
                                            Hidden
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Manage notes
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}

                {(!subjects || subjects.length === 0) && (
                    <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
                        No subjects found. Create one to get started.
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingSubject ? 'Edit Subject' : 'Add Subject'}
            >
                <SubjectForm
                    initialData={editingSubject}
                    onSuccess={() => setIsModalOpen(false)}
                />
            </Modal>
        </>
    )
}
