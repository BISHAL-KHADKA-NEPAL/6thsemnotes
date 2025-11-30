'use client'

import { useState } from 'react'
import Link from 'next/link'
import Modal from './Modal'
import NoteForm from './NoteForm'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function NoteList({ subject, notes }: { subject: any, notes: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingNote, setEditingNote] = useState<any>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this note?')) return

        await supabase.from('notes').delete().eq('id', id)
        router.refresh()
    }

    const toggleVisibility = async (id: string, currentlyHidden: boolean) => {
        await supabase
            .from('notes')
            .update({ is_hidden: !currentlyHidden })
            .eq('id', id)
        router.refresh()
    }

    return (
        <>
            <div className="mb-8">
                <Link
                    href="/admin"
                    className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-4 inline-block"
                >
                    ← Back to Dashboard
                </Link>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {subject.title}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Manage notes for this subject
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingNote(null)
                            setIsModalOpen(true)
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500"
                    >
                        Add Note
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                {notes?.map((note) => (
                    <div
                        key={note.id}
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className={`text-lg font-semibold text-slate-900 dark:text-white ${note.is_hidden ? 'opacity-50' : ''}`}>
                                        {note.title}
                                    </h3>
                                    {note.is_hidden && (
                                        <span className="px-2 py-0.5 text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded">
                                            Hidden
                                        </span>
                                    )}
                                </div>
                                <p className={`text-slate-500 dark:text-slate-400 mt-1 ${note.is_hidden ? 'opacity-50' : ''}`}>
                                    {note.description}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleVisibility(note.id, note.is_hidden)}
                                    className={`p-2 ${note.is_hidden ? 'text-slate-400 hover:text-green-600' : 'text-blue-600 hover:text-slate-400'} hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors`}
                                    title={note.is_hidden ? 'Show note' : 'Hide note'}
                                >
                                    <span className="material-symbols-outlined text-xl">
                                        {note.is_hidden ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingNote(note)
                                        setIsModalOpen(true)
                                    }}
                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined text-xl">edit</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(note.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined text-xl">delete</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {note.pdf_url && (
                                <a
                                    href={note.pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                                    PDF
                                </a>
                            )}
                            {note.image_url && (
                                <a
                                    href={note.image_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">image</span>
                                    Image
                                </a>
                            )}
                            {note.material_urls?.map((material: any, idx: number) => (
                                <a
                                    key={idx}
                                    href={material.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">link</span>
                                    {material.title}
                                </a>
                            ))}
                        </div>
                    </div>
                ))}

                {(!notes || notes.length === 0) && (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        No notes found. Add one to get started.
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingNote ? 'Edit Note' : 'Add Note'}
            >
                <NoteForm
                    subjectId={subject.id}
                    initialData={editingNote}
                    onSuccess={() => setIsModalOpen(false)}
                />
            </Modal>
        </>
    )
}
