'use client';

import React, { useState } from 'react';
import { verifyUser } from '@/app/actions/verify';

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type VerificationState = 'locked' | 'error' | 'success';

export function VerificationModal({ isOpen, onClose, onSuccess }: VerificationModalProps) {
    const [verificationCode, setVerificationCode] = useState('');
    const [state, setState] = useState<VerificationState>('locked');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleVerify = async () => {
        setIsLoading(true);
        try {
            const result = await verifyUser(verificationCode);
            if (result.success) {
                setState('success');
            } else {
                setState('error');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setState('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccessNotes = () => {
        onSuccess();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <span className="material-symbols-outlined text-slate-400 text-xl">close</span>
                </button>

                {/* Locked State */}
                {state === 'locked' && (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-blue-500 text-3xl">lock</span>
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 mb-2">Unlock Your Notes</h2>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            To access the notes, please follow our Instagram account to receive a verification code.
                        </p>

                        <a
                            href="https://www.instagram.com/geo.animator/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all mb-8 shadow-lg shadow-blue-500/20"
                        >
                            <span className="material-symbols-outlined text-xl">link</span>
                            Follow on Instagram
                        </a>

                        <div className="text-left">
                            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                                Enter Verification Code
                            </label>
                            <input
                                type="text"
                                placeholder="Enter code here"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium"
                            />
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={isLoading || !verificationCode}
                            className="w-full mt-4 bg-blue-100 hover:bg-blue-200 text-blue-600 font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Verifying...' : 'Verify Code'}
                        </button>

                        <button className="mt-6 text-blue-500 text-sm font-semibold hover:underline">
                            Need Help?
                        </button>
                    </div>
                )}

                {/* Error State */}
                {state === 'error' && (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-red-500 text-3xl">error</span>
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 mb-2">Verification Failed</h2>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            The code you entered is incorrect. Please check the code and try again.
                        </p>

                        <div className="text-left mb-2">
                            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                                Enter Verification Code
                            </label>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all text-slate-900 font-medium bg-red-50/50"
                            />
                        </div>

                        <div className="flex items-start gap-2 text-red-500 text-xs font-medium mb-6 text-left">
                            <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                            <p>Incorrect code. Did you follow our Instagram account correctly?</p>
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={isLoading || !verificationCode}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                        >
                            {isLoading ? 'Verifying...' : 'Verify Code'}
                        </button>

                        <button className="mt-6 text-blue-500 text-sm font-semibold hover:underline">
                            Need Help?
                        </button>
                    </div>
                )}

                {/* Success State */}
                {state === 'success' && (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 mb-2">Notes Unlocked!</h2>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            Your verification was successful. You now have access to all the notes.
                        </p>

                        <button
                            onClick={handleAccessNotes}
                            className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                        >
                            Access Notes
                            <span className="material-symbols-outlined text-xl">arrow_forward</span>
                        </button>

                        <button className="mt-6 text-blue-500 text-sm font-semibold hover:underline">
                            Need Help?
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
