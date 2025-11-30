'use client';

import { useEffect } from 'react';
import { trackSubjectView } from '@/utils/tracking';

interface SubjectViewTrackerProps {
    subjectId: string;
}

export function SubjectViewTracker({ subjectId }: SubjectViewTrackerProps) {
    useEffect(() => {
        trackSubjectView(subjectId);
    }, [subjectId]);

    return null;
}
