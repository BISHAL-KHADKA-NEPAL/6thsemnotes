'use client';

import React, { useState, useMemo } from 'react';
import { SearchBar } from './SearchBar';
import { SubjectCard } from './SubjectCard';
import { Subject } from '../types';

interface SubjectBrowserProps {
    initialSubjects: Subject[];
}

export function SubjectBrowser({ initialSubjects }: SubjectBrowserProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredSubjects = useMemo(() => {
        console.log('Filtering subjects. Initial:', initialSubjects.length, 'Query:', searchQuery);
        return initialSubjects.filter((subject) =>
            subject.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [initialSubjects, searchQuery]);

    return (
        <>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            <h2 className="text-slate-800 dark:text-slate-200 text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Your Subjects ({filteredSubjects.length})
            </h2>

            {/* Debug Info */}
            <div className="px-4 text-xs text-slate-400">
                Debug: Loaded {initialSubjects.length} subjects.
            </div>

            {filteredSubjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 p-4">
                    {filteredSubjects.map((subject) => (
                        <SubjectCard key={subject.id} subject={subject} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
                    <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                    <p>No subjects found matching "{searchQuery}"</p>
                </div>
            )}
        </>
    );
}
