import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import NoteList from '@/components/admin/NoteList'

export default async function SubjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: subject } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', id)
        .single()

    if (!subject) {
        notFound()
    }

    const { data: notes } = await supabase
        .from('notes')
        .select('*')
        .eq('subject_id', id)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                <NoteList subject={subject} notes={notes || []} />
            </div>
        </div>
    )
}
