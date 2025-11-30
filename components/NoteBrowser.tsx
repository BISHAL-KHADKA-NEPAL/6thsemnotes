'use client';

import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { VerificationModal } from './VerificationModal';
import { createClient } from '@/utils/supabase/client';

interface NoteBrowserProps {
    initialNotes: Note[];
    subjectSlug: string;
}

export const NoteBrowser: React.FC<NoteBrowserProps> = ({ initialNotes, subjectSlug }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [notes, setNotes] = useState(initialNotes);
    const [isVerified, setIsVerified] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [isLoadingVerification, setIsLoadingVerification] = useState(true);

    useEffect(() => {
        checkVerificationStatus();
    }, []);

    const checkVerificationStatus = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_verified')
                    .eq('id', user.id)
                    .single();

                if (profile?.is_verified) {
                    setIsVerified(true);
                }
            }
        } catch (error) {
            console.error('Error checking verification status:', error);
        } finally {
            setIsLoadingVerification(false);
        }
    };

    const handleResourceClick = (e: React.MouseEvent) => {
        if (!isVerified) {
            e.preventDefault();
            setShowVerificationModal(true);
        }
    };

    const handleVerificationSuccess = () => {
        setIsVerified(true);
        setShowVerificationModal(false);
    };

    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <VerificationModal
                isOpen={showVerificationModal}
                onClose={() => setShowVerificationModal(false)}
                onSuccess={handleVerificationSuccess}
            />

            {/* Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
                </div>
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-sm font-medium"
                />
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 gap-4">
                {filteredNotes.map((note) => (
                    <div
                        key={note.id}
                        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700/50"
                    >
                        <div className="mb-4">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                                {note.title}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                                {note.description}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {note.pdfUrls?.map((pdfUrl, idx) => (
                                <button
                                    key={`pdf-${idx}`}
                                    onClick={(e) => {
                                        handleResourceClick(e);
                                        if (isVerified) window.open(pdfUrl, '_blank');
                                    }}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-xs font-bold uppercase tracking-wider hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                                    PDF {note.pdfUrls.length > 1 ? idx + 1 : ''}
                                </button>
                            ))}
                            {note.imageUrls?.map((imageUrl, idx) => (
                                <button
                                    key={`img-${idx}`}
                                    onClick={(e) => {
                                        handleResourceClick(e);
                                        if (isVerified) window.open(imageUrl, '_blank');
                                    }}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 text-xs font-bold uppercase tracking-wider hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-lg">image</span>
                                    Image {note.imageUrls.length > 1 ? idx + 1 : ''}
                                </button>
                            ))}
                            {note.materialUrls?.map((material, idx) => (
                                <button
                                    key={`mat-${idx}`}
                                    onClick={(e) => {
                                        handleResourceClick(e);
                                        if (isVerified) window.open(material.url, '_blank');
                                    }}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-lg">link</span>
                                    {material.title || 'Link'}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredNotes.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                            <span className="material-symbols-outlined text-3xl text-slate-400">search_off</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No notes found</h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            Try adjusting your search terms
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
