'use client';

import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
    const [view, setView] = useState<'login' | 'signup'>(initialView);

    useEffect(() => {
        if (isOpen) {
            setView(initialView);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialView]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-slate-50 dark:bg-slate-900 rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                {view === 'login' ? (
                    <LoginForm
                        onSuccess={onClose}
                        switchToSignup={() => setView('signup')}
                    />
                ) : (
                    <SignupForm
                        onSuccess={onClose}
                        switchToLogin={() => setView('login')}
                    />
                )}
            </div>
        </div>
    );
}
