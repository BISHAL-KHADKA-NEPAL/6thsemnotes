import { createClient } from '@/utils/supabase/server'
import SubjectList from '@/components/admin/SubjectList'

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: subjects } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: true })

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                <SubjectList subjects={subjects || []} />
            </div>
        </div>
    )
}
