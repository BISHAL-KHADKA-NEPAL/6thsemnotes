'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { trackLogin } from '@/utils/sessionTracking';

interface LoginFormProps {
    onSuccess: () => void;
    switchToSignup: () => void;
}

export function LoginForm({ onSuccess, switchToSignup }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            // Track login session
            await trackLogin();

            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4 text-blue-500">
                    <span className="material-symbols-outlined text-3xl">school</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">BBA 6TH SEM NOTES</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Welcome Back!</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Email or Username
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email or username"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">
                            Password
                        </label>
                        <button type="button" className="text-sm font-medium text-blue-500 hover:text-blue-600">
                            Forgot Password?
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                            <span className="material-symbols-outlined text-xl">
                                {showPassword ? 'visibility' : 'visibility_off'}
                            </span>
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={switchToSignup}
                        className="font-bold text-blue-500 hover:text-blue-600"
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
}
