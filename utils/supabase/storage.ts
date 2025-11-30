import { createClient } from './client'

export const uploadFile = async (bucket: string, path: string, file: File) => {
    const supabase = createClient()
    const { data, error } = await supabase.storage.from(bucket).upload(path, file)
    if (error) {
        throw error
    }
    return data
}

export const getPublicUrl = (bucket: string, path: string) => {
    const supabase = createClient()
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
}
