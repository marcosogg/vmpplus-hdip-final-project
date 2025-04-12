import { supabase } from '@/lib/supabase';
import { handleApiError } from './api-utils';
import { ApiResponse } from '@/types/api';

export async function uploadAvatar(userId: string, file: File): Promise<ApiResponse<string>> {
  return handleApiError(async () => {
    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    // Remove the bucket name from the path - Supabase will add it automatically
    const filePath = fileName;

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  });
} 