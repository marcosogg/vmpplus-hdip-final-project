import { supabase } from '@/lib/supabase';
import { handleApiError } from './api-utils';
import { ApiResponse } from '@/types/api';
import { Database } from '@/types/supabase';

// Base vendor type from the database
export type VendorBase = Database['public']['Tables']['vendors']['Row'];

// Extended vendor type with rating property
export type Vendor = VendorBase & {
  rating?: number | null;
};

export type VendorInsert = Database['public']['Tables']['vendors']['Insert'];
export type VendorUpdate = Database['public']['Tables']['vendors']['Update'];

// Get all vendors
export async function getVendors(searchTerm: string | null = null): Promise<ApiResponse<Vendor[]>> {
  return handleApiError(async () => {
    let query = supabase
      .from('vendors')
      .select('*');

    // Apply search filter if searchTerm is provided
    if (searchTerm) {
      // Using 'ilike' for case-insensitive search. Adjust if exact match needed.
      query = query.ilike('name', `%${searchTerm}%`); 
    }
    
    // Apply default ordering
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
      
    if (error) throw error;
    
    // Alias score as rating for consistency
    return data?.map(vendor => ({
      ...vendor,
      rating: vendor.score // Add rating property from score
    })) || [];
  });
}

// Get a single vendor by ID
export async function getVendorById(id: string): Promise<ApiResponse<Vendor>> {
  return handleApiError(async () => {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    // Alias score as rating for consistency
    return data ? {
      ...data,
      rating: data.score // Add rating property from score
    } : null;
  });
}

// Create a new vendor
export async function createVendor(vendor: VendorInsert): Promise<ApiResponse<Vendor>> {
  return handleApiError(async () => {
    // Get the current user first
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    // Then insert the vendor with the user ID
    const { data, error } = await supabase
      .from('vendors')
      .insert({
        ...vendor,
        created_by: userId
      })
      .select()
      .single();
      
    if (error) throw error;
    return data as Vendor;
  });
}

// Update an existing vendor
export async function updateVendor(
  id: string,
  updates: VendorUpdate
): Promise<ApiResponse<Vendor>> {
  return handleApiError(async () => {
    const { data, error } = await supabase
      .from('vendors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Vendor;
  });
}

// Delete a vendor
export async function deleteVendor(id: string): Promise<ApiResponse<null>> {
  return handleApiError(async () => {
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return null;
  });
}

// Get total count of vendors
export async function getVendorCount(): Promise<ApiResponse<number>> {
  return handleApiError(async () => {
    const { count, error } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  });
}

// Get count of active vendors
export async function getActiveVendorCount(): Promise<ApiResponse<number>> {
  return handleApiError(async () => {
    const { count, error } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    
    if (error) throw error;
    return count || 0;
  });
}

// Get average vendor rating
export async function getAverageVendorRating(): Promise<ApiResponse<number>> {
  return handleApiError(async () => {
    // Use 'score' column instead of 'rating'
    const { data, error } = await supabase
      .from('vendors')
      .select('score')
      .not('score', 'is', null);
      
    if (error) throw error;
    
    // Calculate average rating from score
    if (!data || data.length === 0) return 0;
    
    const totalScore = data.reduce((sum, vendor) => {
      return sum + (vendor.score || 0);
    }, 0);
    
    return parseFloat((totalScore / data.length).toFixed(1));
  });
}

// Get top rated vendors
export async function getTopRatedVendors(limit: number = 4): Promise<ApiResponse<Vendor[]>> {
  return handleApiError(async () => {
    // Fetch vendors ordered by score (descending), but return score aliased as 'rating'
    const { data, error } = await supabase
      .from('vendors')
      .select('*, score')
      .not('score', 'is', null)
      .order('score', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    
    // Manually transform data to alias 'score' as 'rating'
    return data?.map(vendor => ({
      ...vendor,
      rating: vendor.score // Add rating property from score
    })) || [];
  });
}

// Get recent vendors
export async function getRecentVendors(limit: number = 5): Promise<ApiResponse<Vendor[]>> {
  return handleApiError(async () => {
    // Fetch vendors ordered by creation date (descending)
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    
    // Alias score as rating for consistency
    return data?.map(vendor => ({
      ...vendor,
      rating: vendor.score // Add rating property from score
    })) || [];
  });
} 