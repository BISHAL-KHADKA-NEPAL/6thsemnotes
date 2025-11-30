import React from "react";
import { Header } from "../../../components/Header";
import { NoteBrowser } from "../../../components/NoteBrowser";
import { createClient } from "@/utils/supabase/server";
import { Note } from "../../../types";
import { notFound } from "next/navigation";
import { SubjectViewTracker } from "../../../components/SubjectViewTracker";

export default async function SubjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const supabase = await createClient();

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    let isAdmin = false;

    if (user) {
        const { data: adminData } = await supabase
            .from('admins')
            .select('id')
            .eq('id', user.id)
            .single();
        isAdmin = !!adminData;
    }

    // Fetch Subject
    const { data: subject } = await supabase
        .from('subjects')
        .select('title')
        .eq('id', slug)
        .single();

    if (!subject) {
        notFound();
    }

    // Fetch Notes - filter hidden ones for non-admins
    let query = supabase
        .from('notes')
        .select('*')
        .eq('subject_id', slug)
        .order('created_at', { ascending: false });

    if (!isAdmin) {
        query = query.eq('is_hidden', false);
    }

    const { data: notesData } = await query;

    // Map database fields to TypeScript interface
    const notes: Note[] = (notesData || []).map((n) => ({
        id: n.id,
        subjectId: n.subject_id,
        title: n.title,
        description: n.description || "",
        pdfUrls: n.pdf_urls || [],
        imageUrls: n.image_urls || [],
        materialUrls: n.material_urls || [],
        createdAt: n.created_at,
    }));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
            <SubjectViewTracker subjectId={slug} />
            <Header />
            <main className="px-4 md:px-10 pb-10 max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm font-medium text-blue-500 mb-4">
                    <a href="/" className="hover:underline">
                        Subjects
                    </a>
                    <span className="text-slate-400">/</span>
                    <span className="text-slate-800 dark:text-slate-200">
                        {subject.title}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight mb-8">
                    {subject.title}
                </h1>

                <NoteBrowser initialNotes={notes} subjectSlug={slug} />
            </main>
        </div>
    );
}
