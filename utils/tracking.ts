import { createClient } from '@/utils/supabase/client';

export type ActivityType =
    | 'subject_view'
    | 'note_view'
    | 'material_view'
    | 'material_download';

export type MaterialType = 'pdf' | 'image' | 'link';

interface TrackActivityParams {
    activityType: ActivityType;
    subjectId?: string;
    noteId?: string;
    materialType?: MaterialType;
    materialUrl?: string;
    metadata?: Record<string, any>;
}

/**
 * Track user activity in the database
 */
export async function trackActivity({
    activityType,
    subjectId,
    noteId,
    materialType,
    materialUrl,
    metadata,
}: TrackActivityParams): Promise<void> {
    try {
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            // Don't track if user is not logged in
            return;
        }

        // Insert activity record
        const { error } = await supabase
            .from('user_activity')
            .insert({
                user_id: user.id,
                activity_type: activityType,
                subject_id: subjectId,
                note_id: noteId,
                material_type: materialType,
                material_url: materialUrl,
                metadata: metadata || {},
            });

        if (error) {
            console.error('Error tracking activity:', error);
        }
    } catch (error) {
        console.error('Error in trackActivity:', error);
    }
}

/**
 * Track subject view
 */
export async function trackSubjectView(subjectId: string): Promise<void> {
    await trackActivity({
        activityType: 'subject_view',
        subjectId,
    });
}

/**
 * Track note view
 */
export async function trackNoteView(
    subjectId: string,
    noteId: string
): Promise<void> {
    await trackActivity({
        activityType: 'note_view',
        subjectId,
        noteId,
    });
}

/**
 * Track material view (PDF, image, etc.)
 */
export async function trackMaterialView(
    subjectId: string,
    noteId: string,
    materialType: MaterialType,
    materialUrl: string
): Promise<void> {
    await trackActivity({
        activityType: 'material_view',
        subjectId,
        noteId,
        materialType,
        materialUrl,
    });
}

/**
 * Track material download
 */
export async function trackMaterialDownload(
    subjectId: string,
    noteId: string,
    materialType: MaterialType,
    materialUrl: string
): Promise<void> {
    await trackActivity({
        activityType: 'material_download',
        subjectId,
        noteId,
        materialType,
        materialUrl,
    });
}
