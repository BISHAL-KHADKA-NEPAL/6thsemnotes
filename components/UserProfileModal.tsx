'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    profile: any;
    onProfileUpdate: () => void;
    onLogout: () => void;
}

type TabType = 'profile' | 'account' | 'notifications' | 'activity';

export function UserProfileModal({ isOpen, onClose, user, profile, onProfileUpdate, onLogout }: UserProfileModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [loading, setLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [sessions, setSessions] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        if (isOpen && activeTab === 'account') {
            fetchSessions();
        }
        if (isOpen && activeTab === 'notifications') {
            fetchNotifications();
        }
        if (isOpen && activeTab === 'activity') {
            fetchActivities();
        }
    }, [isOpen, activeTab]);

    const fetchSessions = async () => {
        const { data } = await supabase
            .from('user_sessions')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('login_at', { ascending: false });
        setSessions(data || []);
    };

    const fetchNotifications = async () => {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);
        setNotifications(data || []);
    };

    const fetchActivities = async () => {
        const { data } = await supabase
            .from('user_activity')
            .select('*, subjects(title)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);
        setActivities(data || []);
    };

    const handleProfileUpdate = async () => {
        setLoading(true);
        const { error } = await supabase
            .from('profiles')
            .update({ full_name: fullName })
            .eq('id', user.id);

        if (!error) {
            onProfileUpdate();
        }
        setLoading(false);
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            alert(error.message);
        } else {
            alert('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
        setLoading(false);
    };

    const handleLogoutSession = async (sessionId: string) => {
        await supabase
            .from('user_sessions')
            .update({ is_active: false, logout_at: new Date().toISOString() })
            .eq('id', sessionId);
        fetchSessions();
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'subject_view': return 'visibility';
            case 'note_view': return 'visibility';
            case 'material_view': return 'visibility';
            case 'material_download': return 'download';
            default: return 'circle';
        }
    };

    const getActivityText = (activity: any) => {
        switch (activity.activity_type) {
            case 'subject_view':
                return `Viewed: ${activity.subjects?.title || 'Subject'}`;
            case 'note_view':
                return `Viewed: Note`;
            case 'material_view':
                return `Viewed: ${activity.material_type?.toUpperCase()} material`;
            case 'material_download':
                return `Downloaded: ${activity.material_type?.toUpperCase()} material`;
            default:
                return activity.activity_type;
        }
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

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col md:flex-row">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-800 p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 overflow-x-auto md:overflow-visible">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">User Profile</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your profile and account settings.</p>
                        </div>

                        <nav className="flex md:flex-col gap-2 min-w-max md:min-w-0">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap ${activeTab === 'profile'
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-xl">person</span>
                                <span className="font-semibold">Profile</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('account')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap ${activeTab === 'account'
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-xl">lock</span>
                                <span className="font-semibold">Account</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap ${activeTab === 'notifications'
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-xl">notifications</span>
                                <span className="font-semibold">Notifications</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap ${activeTab === 'activity'
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-xl">history</span>
                                <span className="font-semibold">Activity</span>
                            </button>

                            {/* Logout Button */}
                            <div className="md:pt-4 md:mt-4 md:border-t border-slate-200 dark:border-slate-700 flex md:block">
                                <button
                                    onClick={onLogout}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 whitespace-nowrap"
                                >
                                    <span className="material-symbols-outlined text-xl">logout</span>
                                    <span className="font-semibold">Logout</span>
                                </button>
                            </div>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-8">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <span className="material-symbols-outlined text-slate-500">close</span>
                            </button>

                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Personal Information</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Update your photo and personal details.</p>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                                        <div className="flex-shrink-0">
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-full bg-[#E6B68E] flex items-center justify-center text-white text-3xl font-bold">
                                                    {profile?.avatar_url ? (
                                                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()
                                                    )}
                                                </div>
                                                <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700">
                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    value={user.email}
                                                    disabled
                                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400"
                                                />
                                            </div>

                                            <button
                                                onClick={handleProfileUpdate}
                                                disabled={loading}
                                                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Recent Activity Summary */}
                                    <div className="mt-12">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Recent Activity</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">A summary of your recent interactions.</p>

                                        <div className="space-y-3">
                                            {activities.slice(0, 3).map((activity) => (
                                                <div key={activity.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">
                                                            {getActivityIcon(activity.activity_type)}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {getActivityText(activity)}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {activity.subjects?.title || 'Activity'}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs text-slate-400">{getTimeAgo(activity.created_at)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Account Tab */}
                            {activeTab === 'account' && (
                                <div className="space-y-8">
                                    {/* Change Password */}
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Change Password</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Update your password for enhanced security.</p>

                                        <div className="space-y-4 max-w-xl">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                />
                                            </div>

                                            <button
                                                onClick={handlePasswordChange}
                                                disabled={loading}
                                                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {loading ? 'Saving...' : 'Save Password'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Login Activity */}
                                    <div className="mt-12">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Login Activity</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Sessions from your connected devices.</p>

                                        <div className="space-y-3">
                                            {sessions.map((session) => (
                                                <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
                                                                {session.device_info?.deviceType === 'mobile' ? 'smartphone' : 'computer'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                                {session.device_info?.browser} on {session.device_info?.os}
                                                            </p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                {new Date(session.login_at).toLocaleString()} • Current session
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleLogoutSession(session.id)}
                                                        className="text-sm font-medium text-blue-500 hover:text-blue-600"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Notifications</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">View and manage your notifications.</p>
                                    </div>

                                    <div className="space-y-3">
                                        {notifications.length === 0 ? (
                                            <div className="text-center py-12">
                                                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">
                                                    notifications_off
                                                </span>
                                                <p className="text-slate-500 dark:text-slate-400">No notifications yet</p>
                                            </div>
                                        ) : (
                                            notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`p-4 rounded-lg border ${notification.is_read
                                                        ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                                        : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                                    {notification.title}
                                                                </p>
                                                                {!notification.is_read && (
                                                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-slate-400 mt-2">
                                                                {getTimeAgo(notification.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Activity Tab */}
                            {activeTab === 'activity' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Activity History</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Your complete activity timeline.</p>
                                    </div>

                                    <div className="space-y-3">
                                        {activities.length === 0 ? (
                                            <div className="text-center py-12">
                                                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">
                                                    history
                                                </span>
                                                <p className="text-slate-500 dark:text-slate-400">No activity yet</p>
                                            </div>
                                        ) : (
                                            activities.map((activity) => (
                                                <div key={activity.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">
                                                            {getActivityIcon(activity.activity_type)}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                            {getActivityText(activity)}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                            {activity.subjects?.title || 'Activity'}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs text-slate-400 flex-shrink-0">{getTimeAgo(activity.created_at)}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
