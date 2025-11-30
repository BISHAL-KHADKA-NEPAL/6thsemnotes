'use client';

import React, { useEffect } from 'react';

interface ResourceViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    type: 'pdf' | 'image';
    title: string;
}

export function ResourceViewerModal({ isOpen, onClose, url, type, title }: ResourceViewerModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 z-10">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate pr-4">
                        {title}
                    </h3>
                    <div className="flex items-center gap-2">
                        <a
                            href={url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">download</span>
                            <span className="hidden sm:inline">Download</span>
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-slate-100 dark:bg-black/50 overflow-auto flex items-center justify-center p-4">
                    {type === 'pdf' ? (
                        <iframe
                            src={url}
                            className="w-full h-full rounded-lg shadow-sm"
                            title={title}
                        />
                    ) : (
                        <img
                            src={url}
                            alt={title}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
