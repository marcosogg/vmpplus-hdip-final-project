import { supabase } from '@/lib/supabase';
import { handleApiError } from './api-utils';
import { ApiResponse } from '@/types/api';
import { Database } from '@/types/supabase';

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

// Update the last login timestamp for a user
export async function updateLastLogin(userId: string): Promise<ApiResponse<Profile>> {
  return handleApiError(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
      
    if (error) throw error;
    return data as Profile;
  });
}

// Create a profile for a new user (called after signup)
export async function createProfile(userId: string, email: string): Promise<ApiResponse<Profile>> {
  return handleApiError(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        role_id: '60b1896f-ba73-45e1-878d-e49badca6f78' // Buyer role ID
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Profile;
  });
} 