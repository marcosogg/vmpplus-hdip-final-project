import { supabase } from '@/lib/supabase';
import { handleApiError } from './api-utils';
import { ApiResponse } from '@/types/api';
import { Database } from '@/types/supabase';

export type Vendor = Database['public']['Tables']['vendors']['Row'];
export type VendorInsert = Database['public']['Tables']['vendors']['Insert'];
export type VendorUpdate = Database['public']['Tables']['vendors']['Update'];

// Get all vendors, optionally filtered by name
export async function getVendors(searchTerm?: string): Promise<ApiResponse<Vendor[]>> {
  return handleApiError(async () => {
    console.log(`[getVendors] Searching vendors with term: "${searchTerm}"`);
    
    let query = supabase
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: false });

    // If a search term is provided, filter by name (case-insensitive) or other relevant fields
    if (searchTerm && searchTerm.trim()) {
      // Clean the search term
      const cleanSearchTerm = searchTerm.trim();
      console.log(`[getVendors] Using cleaned search term: "${cleanSearchTerm}"`);
      
      // Search across multiple fields (name, email, and category)
      query = query.or(`name.ilike.%${cleanSearchTerm}%,email.ilike.%${cleanSearchTerm}%,category.ilike.%${cleanSearchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[getVendors] Supabase query error:", error);
      throw error;
    }

    console.log(`[getVendors] Query returned ${data?.length || 0} vendors`);
    return (data as Vendor[] | null) || [];
  });
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

// Get total count of vendors
export async function getVendorCount(): Promise<ApiResponse<number>> {
  return handleApiError(
    supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (error) throw error;
        return count || 0;
      })
  );
}

// Get count of active vendors
export async function getActiveVendorCount(): Promise<ApiResponse<number>> {
  return handleApiError(
    supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .then(({ count, error }) => {
        if (error) throw error;
        return count || 0;
      })
  );
}

// Get recent vendors
export async function getRecentVendors(limit: number = 5): Promise<ApiResponse<Vendor[]>> {
  return handleApiError(
    supabase
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
      .then(({ data, error }) => {
        if (error) throw error;
        return data as Vendor[];
      })
  );
}

/*
-- Required SQL Function for RPC (Execute in Supabase SQL Editor or add via migration):
CREATE OR REPLACE FUNCTION get_vendor_count_by_category_coalesced()
RETURNS TABLE(category TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Use COALESCE to treat NULL and empty strings as 'Uncategorized'
    COALESCE(NULLIF(TRIM(v.category), ''), 'Uncategorized') as category,
    COUNT(*) as count
  FROM public.vendors v
  -- Group by the potentially coalesced category name
  GROUP BY COALESCE(NULLIF(TRIM(v.category), ''), 'Uncategorized')
  ORDER BY count DESC; -- Optional: Order by count
END; $$ LANGUAGE plpgsql;
*/

// Get vendor count grouped by category (using direct query and JS processing)
export async function getVendorCountByCategory(): Promise<ApiResponse<{ category: string; count: number }[]>> {
  return handleApiError(async () => {
    // Fetch all vendors with their categories
    const { data, error } = await supabase
      .from('vendors')
      .select('category'); // Only select the category

    if (error) {
      console.error("[getVendorCountByCategory] Supabase query error:", error);
      throw error;
    }

    // Process data in JavaScript to group and coalesce
    const categoryCounts: Record<string, number> = {};

    (data || []).forEach(vendor => {
      // Trim whitespace, check for null/empty, default to 'Uncategorized'
      const category = vendor.category?.trim() ? vendor.category.trim() : 'Uncategorized';
      
      // Increment count for the category
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    // Convert the counts object into the desired array format
    const processedData = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count
    })).sort((a, b) => b.count - a.count); // Optional: sort by count descending

    return processedData;
  });
}

// Get top N vendors based on score
export async function getTopScoredVendors(limit: number = 5): Promise<ApiResponse<Vendor[]>> {
  return handleApiError(async () => {
    const { data, error } = await supabase
      .from('vendors')
      .select('id, name, score, logo_url') // Select only needed fields
      .not('score', 'is', null)           // Filter out vendors without a score
      .order('score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[getTopScoredVendors] Supabase error:", error);
      throw error;
    }

    return (data as Vendor[] | null) || []; // Return data or empty array
  });
} 