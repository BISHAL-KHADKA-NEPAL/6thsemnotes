'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface Notification {
    id: string;
    title: string;
    message: string;
    link: string | null;
    type: string;
    is_read: boolean;
    created_at: string;
}

interface NotificationsDropdownProps {
    userId: string;
}

export function NotificationsDropdown({ userId }: NotificationsDropdownProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const supabase = createClient();

    useEffect(() => {
        fetchNotifications();

        // Subscribe to real-time notifications
        const channel = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    setNotifications((prev) => [payload.new as Notification, ...prev]);
                    setUnreadCount((prev) => prev + 1);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const fetchNotifications = async () => {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (data) {
            setNotifications(data);
            setUnreadCount(data.filter((n) => !n.is_read).length);
        }
    };

    const markAsRead = async (notificationId: string) => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId);

        setNotifications((prev) =>
            prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const markAllAsRead = async () => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
    };

    const getTimeAgo = (timestamp: string) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center justify-center size-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
                <span className="material-symbols-outlined text-slate-800 dark:text-slate-200">
                    notifications
                </span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 z-50 max-h-[500px] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs font-medium text-blue-500 hover:text-blue-600"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto flex-1">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">
                                        notifications_off
                                    </span>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        No notifications yet
                                    </p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${!notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                            }`}
                                    >
                                        {notification.link ? (
                                            <Link
                                                href={notification.link}
                                                onClick={() => {
                                                    markAsRead(notification.id);
                                                    setIsOpen(false);
                                                }}
                                                className="block"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                                                {notification.title}
                                                            </p>
                                                            {!notification.is_read && (
                                                                <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                                            {getTimeAgo(notification.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ) : (
                                            <div className="flex items-start gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                                            {notification.title}
                                                        </p>
                                                        {!notification.is_read && (
                                                            <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                                        {getTimeAgo(notification.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
