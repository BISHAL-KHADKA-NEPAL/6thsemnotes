import { createClient } from '@/utils/supabase/client';

interface DeviceInfo {
    browser: string;
    os: string;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    screenResolution: string;
}

/**
 * Get device and browser information
 */
export function getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;

    // Detect browser
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';

    // Detect OS
    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    // Detect device type
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    if (/Mobile|Android|iPhone/i.test(userAgent)) deviceType = 'mobile';
    else if (/iPad|Tablet/i.test(userAgent)) deviceType = 'tablet';

    // Get screen resolution
    const screenResolution = `${window.screen.width}x${window.screen.height}`;

    return {
        browser,
        os,
        deviceType,
        screenResolution,
    };
}

/**
 * Track user login and create a new session
 */
export async function trackLogin(): Promise<void> {
    try {
        const supabase = createClient();

        // Get current session
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        const user = session?.user;

        if (!user || !session) {
            console.error('No user or session found');
            return;
        }

        // Get device info
        const deviceInfo = getDeviceInfo();

        // Insert new session record
        const { error } = await supabase
            .from('user_sessions')
            .insert({
                user_id: user.id,
                session_id: session.access_token.substring(0, 50),
                device_info: deviceInfo,
                user_agent: navigator.userAgent,
                ip_address: null,
                login_at: new Date().toISOString(),
                last_activity_at: new Date().toISOString(),
                is_active: true,
            });

        if (error) {
            console.error('Error tracking login:', error);
        }
    } catch (error) {
        console.error('Error in trackLogin:', error);
    }
}

/**
 * Update session activity timestamp
 */
export async function updateSessionActivity(): Promise<void> {
    try {
        const supabase = createClient();

        // Get current session
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        const user = session?.user;

        if (!user || !session) {
            return;
        }

        const sessionId = session.access_token.substring(0, 50);

        // Update last activity timestamp for active session
        const { error } = await supabase
            .from('user_sessions')
            .update({
                last_activity_at: new Date().toISOString(),
            })
            .eq('user_id', user.id)
            .eq('session_id', sessionId)
            .eq('is_active', true);

        if (error) {
            console.error('Error updating session activity:', error);
        }
    } catch (error) {
        console.error('Error in updateSessionActivity:', error);
    }
}

/**
 * Track user logout and end the session
 */
export async function trackLogout(): Promise<void> {
    try {
        const supabase = createClient();

        // Get current session before logging out
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        const user = session?.user;

        if (!user || !session) {
            return;
        }

        const sessionId = session.access_token.substring(0, 50);
        const logoutTime = new Date();

        // Get the login time to calculate duration
        const { data: sessionData } = await supabase
            .from('user_sessions')
            .select('login_at')
            .eq('user_id', user.id)
            .eq('session_id', sessionId)
            .eq('is_active', true)
            .single();

        let sessionDuration = 0;
        if (sessionData?.login_at) {
            const loginTime = new Date(sessionData.login_at);
            sessionDuration = Math.floor((logoutTime.getTime() - loginTime.getTime()) / 1000);
        }

        // Update session with logout info
        const { error } = await supabase
            .from('user_sessions')
            .update({
                logout_at: logoutTime.toISOString(),
                last_activity_at: logoutTime.toISOString(),
                session_duration_seconds: sessionDuration,
                is_active: false,
            })
            .eq('user_id', user.id)
            .eq('session_id', sessionId)
            .eq('is_active', true);

        if (error) {
            console.error('Error tracking logout:', error);
        }
    } catch (error) {
        console.error('Error in trackLogout:', error);
    }
}
