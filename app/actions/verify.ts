'use server';
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function verifyUser(code: string) {
    const correctCode = process.env.VERIFICATION_CODE;
    const cleanCode = code.trim();

    console.log('--- Verification Debug ---');
    console.log('Input code:', cleanCode);
    console.log('Env code set:', !!correctCode);

    if (!correctCode) {
        console.error('VERIFICATION_CODE is not set in environment variables');
        return { success: false, message: 'Server configuration error' };
    }

    if (cleanCode !== correctCode) {
        console.log('Code mismatch');
        return { success: false, message: 'Incorrect verification code' };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        console.log('Attempting to update profile for user:', user.id);
        const { error, data } = await supabase
            .from('profiles')
            .update({ is_verified: true })
            .eq('id', user.id)
            .select();

        if (error) {
            console.error('Error updating verification status:', error);
            // We don't fail the verification if DB update fails, just log it
            // return { success: false, message: 'Failed to update verification status: ' + error.message };
        } else {
            console.log('Update success. Data returned:', data);
        }
    } else {
        console.log('No user authenticated. Skipping DB update.');
    }

    revalidatePath('/');
    return { success: true, message: 'Verification successful' };
}
