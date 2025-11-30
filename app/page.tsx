import React from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Footer } from '../components/Footer';
import { SubjectBrowser } from '../components/SubjectBrowser';
import { createClient } from '@/utils/supabase/server';
import { Subject } from '@/types';

export const dynamic = 'force-dynamic';

export default async function Home() {
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

  // Fetch subjects - filter hidden ones for non-admins
  let query = supabase
    .from('subjects')
    .select('*')
    .order('created_at', { ascending: true });

  if (!isAdmin) {
    query = query.eq('is_hidden', false);
  }

  const { data: subjectsData, error } = await query;

  if (error) {
    console.error('Error fetching subjects:', error);
  }

  console.log('Fetched subjects:', subjectsData);

  // Map database fields to TypeScript interface
  const subjects: Subject[] = (subjectsData || []).map((s) => ({
    id: s.id,
    title: s.title,
    iconName: s.icon_name,
    colorTheme: s.color_theme,
  }));

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header Section */}
        <div className="flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-5xl flex-1 px-4 md:px-10">
            <Header />

            <main>
              <Hero />
              <div id="subjects" className="scroll-mt-24">
                <SubjectBrowser initialSubjects={subjects} />
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}