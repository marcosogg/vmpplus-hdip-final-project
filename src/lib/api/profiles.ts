import { supabase } from '@/lib/supabase';
import { handleApiError } from './api-utils';
import { ApiResponse } from '@/types/api';
import { Database } from '@/types/supabase';

// TODO: Implement profile viewing/editing page using these API calls.
// Currently, these API functions are defined but not utilized in the frontend implementation.

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Get the current user's profile
export async function getCurrentProfile(): Promise<ApiResponse<Profile>> {
  return handleApiError(async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) throw authError;
    if (!user) throw new Error('No authenticated user');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) throw error;
    return data as Profile;
  });
}

// Update the current user's profile
export async function updateProfile(updates: ProfileUpdate): Promise<ApiResponse<Profile>> {
  return handleApiError(async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) throw authError;
    if (!user) throw new Error('No authenticated user');
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
      
    if (error) throw error;
    return data as Profile;
  });
}

// Create a profile for a new user (called after signup)
export async function createProfile(userId: string, email: string): Promise<ApiResponse<Profile>> {
  return handleApiError(
    supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
      })
      .select()
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        return data as Profile;
      })
  );
} 