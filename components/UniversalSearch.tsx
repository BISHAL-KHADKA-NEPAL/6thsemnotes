'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface SearchResult {
    id: string;
    title: string;
    type: 'subject' | 'note';
    subtitle?: string;
    url: string;
}

export function UniversalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const searchAll = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                setIsOpen(false);
                return;
            }

            setLoading(true);
            setIsOpen(true);

            try {
                const searchTerm = `%${query}%`;
                const allResults: SearchResult[] = [];

                // Search subjects
                const { data: subjects } = await supabase
                    .from('subjects')
                    .select('id, title')
                    .ilike('title', searchTerm)
                    .eq('is_hidden', false)
                    .limit(5);

                if (subjects) {
                    subjects.forEach((subject) => {
                        allResults.push({
                            id: subject.id,
                            title: subject.title,
                            type: 'subject',
                            subtitle: 'Subject',
                            url: `/subjects/${subject.id}`,
                        });
                    });
                }

                // Search notes
                const { data: notes } = await supabase
                    .from('notes')
                    .select('id, title, subject_id, subjects(title)')
                    .ilike('title', searchTerm)
                    .eq('is_hidden', false)
                    .limit(5);

                if (notes) {
                    notes.forEach((note: any) => {
                        allResults.push({
                            id: note.id,
                            title: note.title,
                            type: 'note',
                            subtitle: `Note in ${note.subjects?.title || 'Unknown'}`,
                            url: `/subjects/${note.subject_id}`,
                        });
                    });
                }

                setResults(allResults);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchAll, 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'subject':
                return 'book';
            case 'note':
                return 'description';
            default:
                return 'search';
        }
    };

    const groupedResults = {
        subjects: results.filter((r) => r.type === 'subject'),
        notes: results.filter((r) => r.type === 'note'),
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-2xl">
            <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    search
                </span>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    placeholder="Search subjects, notes..."
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setResults([]);
                            setIsOpen(false);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto z-50">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">
                            <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                            No results found for "{query}"
                        </div>
                    ) : (
                        <div className="py-2">
                            {/* Subjects */}
                            {groupedResults.subjects.length > 0 && (
                                <div className="mb-2">
                                    <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Subjects
                                    </div>
                                    {groupedResults.subjects.map((result) => (
                                        <Link
                                            key={result.id}
                                            href={result.url}
                                            onClick={() => {
                                                setIsOpen(false);
                                                setQuery('');
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                                                    {getIcon(result.type)}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                    {result.title}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {result.subtitle}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}



                            {/* Notes */}
                            {groupedResults.notes.length > 0 && (
                                <div>
                                    <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Notes
                                    </div>
                                    {groupedResults.notes.map((result) => (
                                        <Link
                                            key={result.id}
                                            href={result.url}
                                            onClick={() => {
                                                setIsOpen(false);
                                                setQuery('');
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                                <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                                                    {getIcon(result.type)}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                    {result.title}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {result.subtitle}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
