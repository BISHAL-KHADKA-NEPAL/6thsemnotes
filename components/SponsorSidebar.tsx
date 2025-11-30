'use client';

import React, { useState, useEffect } from 'react';

interface SponsorSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    sponsorName?: string;
}

export function SponsorSidebar({ isOpen, onClose, sponsorName = "Bishal Khadka" }: SponsorSidebarProps) {
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

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

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX);
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const diff = e.touches[0].clientX - startX;
        if (diff < 0) {
            setCurrentX(diff);
        }
    };

    const handleTouchEnd = () => {
        if (currentX < -100) {
            onClose();
        }
        setCurrentX(0);
        setIsDragging(false);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setStartX(e.clientX);
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const diff = e.clientX - startX;
        if (diff < 0) {
            setCurrentX(diff);
        }
    };

    const handleMouseUp = () => {
        if (currentX < -100) {
            onClose();
        }
        setCurrentX(0);
        setIsDragging(false);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-slate-800 shadow-2xl z-50 transition-transform duration-300 ease-out"
                style={{
                    transform: `translateX(${isOpen ? currentX : 100}%)`,
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                    <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">close</span>
                </button>

                {/* Content */}
                <div className="p-6 pt-16">
                    {/* Sponsor Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center gap-4">
                            {/* Heart Icon */}
                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-white text-2xl">favorite</span>
                            </div>

                            {/* Text */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {sponsorName}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Sponsor of the day
                                </p>
                            </div>
                        </div>

                        {/* Thank You Message */}
                        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Thank you for supporting our platform! Your contribution helps us provide quality educational content to students.
                        </p>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                💡 Did you know?
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Sponsors help us maintain and improve this platform for all students.
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
                        >
                            Got it, thanks!
                        </button>
                    </div>

                    {/* Swipe Hint */}
                    <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
                        Swipe left or tap outside to close
                    </p>
                </div>
            </div>
        </>
    );
}
