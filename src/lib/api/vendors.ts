import { supabase } from '@/lib/supabase';
import { handleApiError } from './api-utils';
import { ApiResponse } from '@/types/api';
import { Database } from '@/types/supabase';

export type Vendor = Database['public']['Tables']['vendors']['Row'];
export type VendorInsert = Database['public']['Tables']['vendors']['Insert'];
export type VendorUpdate = Database['public']['Tables']['vendors']['Update'];

// Get all vendors
export async function getVendors(): Promise<ApiResponse<Vendor[]>> {
  return handleApiError(
    supabase
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        return data as Vendor[];
      })
  );
}

// Get a single vendor by ID
export async function getVendorById(id: string): Promise<ApiResponse<Vendor>> {
  return handleApiError(
    supabase
      .from('vendors')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        return data as Vendor;
      })
  );
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
  return handleApiError(
    supabase
      .from('vendors')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        return data as Vendor;
      })
  );
}

// Delete a vendor
export async function deleteVendor(id: string): Promise<ApiResponse<null>> {
  return handleApiError(
    supabase
      .from('vendors')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) throw error;
        return null;
      })
  );
} 