'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { createClient } from '@/utils/supabase/client';

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const supabase = createClient();

    useEffect(() => {
        // Auto-fill email for logged-in users
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setEmail(user.email || '');

                // Get user profile for name
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', user.id)
                    .single();

                if (profile?.full_name) {
                    setName(profile.full_name);
                }
            }
        };
        getUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase
                .from('contact_submissions')
                .insert({
                    user_id: user?.id || null,
                    name,
                    email,
                    subject,
                    message,
                });

            if (error) throw error;

            setSuccess(true);
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const faqs = [
        {
            question: 'How do I upload my class notes?',
            answer: 'To upload class notes, navigate to the Admin Dashboard (admin access required). Click the "Upload Notes" button, select the subject, then upload your PDF files and supplemental materials. Once uploaded, the notes will be immediately available to all students.'
        },
        {
            question: 'Can I share my notes with other students?',
            answer: 'Yes! All notes uploaded to the platform are automatically shared with all registered students. Simply upload your notes through the admin panel, and they will be accessible to everyone in the classroom notes hub.'
        },
        {
            question: 'What file formats are supported for note uploads?',
            answer: 'We currently support PDF files for main notes and images (JPG, PNG) for supplemental materials. PDFs are recommended for the best viewing experience across all devices.'
        },
        {
            question: 'Is there a limit to how many notes I can upload?',
            answer: 'There is no limit to the number of notes you can upload. However, we recommend organizing your notes by subject to make them easier to find and access.'
        },
        {
            question: 'How can I find notes for a specific subject?',
            answer: 'Use the subject browser on the homepage to browse all available subjects. Click on any subject to see all associated notes. You can also use the search functionality to quickly find specific topics.'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Header />

            <main className="max-w-6xl mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <p className="text-sm font-semibold text-blue-500 uppercase tracking-wide mb-2">SUPPORT</p>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Get in Touch</h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        We're here to help. Send us a message, and we'll get back to you as soon as possible. Your feedback helps us improve!
                    </p>
                </div>

                {/* Contact Form and Email Section */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {/* Contact Form */}
                    <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send us a Message</h2>

                        {success && (
                            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <p className="text-green-600 dark:text-green-400 font-semibold">Thank you! Your message has been sent successfully.</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Student Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your student email"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Subject
                                </label>
                                <select
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                >
                                    <option value="">Select a subject</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="technical">Technical Issue</option>
                                    <option value="notes">Notes Upload/Access</option>
                                    <option value="feature">Feature Request</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Message
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Describe your issue or feedback in detail..."
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    {/* Email Directly Section */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-white text-2xl">mail</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Email us Directly</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Prefer to use your email client? Feel free to reach out to us directly at:
                        </p>
                        <a
                            href="contact@bishalkhadka.info.np"
                            className="text-blue-500 hover:text-blue-600 font-semibold break-all"
                        >
                            contact@bishalkhadka.info.np
                        </a>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-sm font-semibold text-blue-500 uppercase tracking-wide mb-2">FAQ</p>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Find quick answers to common questions about BBA 6TH SEM NOTES. If you can't find what you're looking for, feel free to contact us directly.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <span className="font-bold text-slate-900 dark:text-white pr-4">
                                        {faq.question}
                                    </span>
                                    <span className="material-symbols-outlined text-slate-400 flex-shrink-0">
                                        {openFaq === index ? 'expand_less' : 'expand_more'}
                                    </span>
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-6">
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        © 2024 BBA 6TH SEM NOTES. All rights reserved.
                    </p>
                    <div className="flex items-center justify-center gap-6 mt-4">
                        <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500">
                            Terms of Service
                        </a>
                        <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500">
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
