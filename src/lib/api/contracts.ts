import { supabase } from '@/lib/supabase';
import { handleApiError } from './api-utils';
import { ApiResponse } from '@/types/api';
import { Database } from '@/types/supabase';

export type Contract = Database['public']['Tables']['contracts']['Row'];
export type ContractInsert = Database['public']['Tables']['contracts']['Insert'];
export type ContractUpdate = Database['public']['Tables']['contracts']['Update'];

// Get all contracts
export async function getContracts(): Promise<ApiResponse<Contract[]>> {
  return handleApiError(
    supabase
      .from('contracts')
      .select('*, vendors(name)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        return data as unknown as Contract[];
      })
  );
}

// Get contracts for a specific vendor
export async function getContractsByVendorId(vendorId: string): Promise<ApiResponse<Contract[]>> {
  return handleApiError(
    supabase
      .from('contracts')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        return data as Contract[];
      })
  );
}

// Get a single contract by ID
export async function getContractById(id: string): Promise<ApiResponse<Contract>> {
  return handleApiError(
    supabase
      .from('contracts')
      .select('*, vendors(name)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        return data as unknown as Contract;
      })
  );
}

// Create a new contract
export async function createContract(contract: ContractInsert): Promise<ApiResponse<Contract>> {
  return handleApiError(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    // Explicitly construct the object for insertion
    const insertData = {
      title: contract.title,
      vendor_id: contract.vendor_id, // Pass the UUID string directly
      description: contract.description,
      start_date: contract.start_date,
      end_date: contract.end_date,
      value: contract.value,
      status: contract.status,
      created_by: userId // Add the user ID
    };

    console.log("[createContract] Explicit insertData:", insertData);

    const { data, error } = await supabase
      .from('contracts')
      .insert(insertData) // Use the explicitly constructed object
      .select()
      .single();

    if (error) {
      console.error("[createContract] Supabase insert error details:", error);
      throw error; // Re-throw to be caught by handleApiError
    }
    return data as Contract;
  });
}

// Update an existing contract
export async function updateContract(
  id: string,
  updates: ContractUpdate
): Promise<ApiResponse<Contract>> {
  return handleApiError(
    supabase
      .from('contracts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        return data as Contract;
      })
  );
}

// Delete a contract
export async function deleteContract(id: string): Promise<ApiResponse<null>> {
  return handleApiError(
    supabase
      .from('contracts')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) throw error;
        return null;
      })
  );
}

// Get total count of contracts
export async function getContractCount(): Promise<ApiResponse<number>> {
  return handleApiError(
    supabase
      .from('contracts')
      .select('*', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (error) throw error;
        return count || 0;
      })
  );
}

// Get count of contracts expiring soon (within 30 days)
export async function getExpiringContractCount(): Promise<ApiResponse<number>> {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  return handleApiError(
    supabase
      .from('contracts')
      .select('*', { count: 'exact', head: true })
      .lte('end_date', thirtyDaysFromNow.toISOString())
      .gt('end_date', new Date().toISOString())
      .then(({ count, error }) => {
        if (error) throw error;
        return count || 0;
      })
  );
}

// Get recent contracts
export async function getRecentContracts(limit: number): Promise<ApiResponse<Contract[]>> {
  return handleApiError(
    supabase
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
      .then(({ data, error }) => {
        if (error) throw error;
        // Ensure we return an empty array if data is null/undefined
        return (data as Contract[] | null) || []; 
      })
  );
}

// Get contract count grouped by status (using direct query and JS processing)
export async function getContractCountByStatus(): Promise<ApiResponse<{ status: string; count: number }[]>> {
  return handleApiError(async () => {
    // Fetch all contract statuses
    const { data, error } = await supabase
      .from('contracts')
      .select('status'); // Only select the status column

    if (error) {
      console.error("[getContractCountByStatus] Supabase query error:", error);
      throw error;
    }

    // Process data in JavaScript to group and normalize status
    const statusCounts: Record<string, number> = {};

    (data || []).forEach(contract => {
      let status = contract.status?.trim(); // Trim whitespace
      
      if (!status) { // Check for null, undefined, or empty string after trim
        status = 'Unknown';
      } else {
         // Convert to Title Case (e.g., "active" -> "Active")
         status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      }
      
      // Increment count for the normalized status
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Convert the counts object into the desired array format
    const processedData = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    })).sort((a, b) => b.count - a.count); // Optional: sort by count descending

    return processedData;
  });
}

/*
-- Required SQL Function for RPC (Execute in Supabase SQL Editor or add via migration):
CREATE OR REPLACE FUNCTION get_total_contract_value_by_vendor(limit_count INT DEFAULT 10)
RETURNS TABLE(name TEXT, total_value NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.name,
    SUM(c.value) as total_value
  FROM public.contracts c
  JOIN public.vendors v ON c.vendor_id = v.id
  WHERE c.value IS NOT NULL AND c.value > 0 -- Ensure value exists and is positive for meaningful sum
  GROUP BY v.id, v.name -- Group by vendor id and name
  ORDER BY total_value DESC
  LIMIT limit_count;
END; $$ LANGUAGE plpgsql;
*/

// Get total contract value grouped by vendor (top N)
export async function getTotalContractValueByVendor(limit: number = 10): Promise<ApiResponse<{ name: string; total_value: number }[]>> {
  return handleApiError(async () => {
    // Instead of RPC, use a direct join and group by with PostgreSQL features
    // This performs the same calculation without requiring a custom SQL function
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        vendor_id,
        vendors!inner (
          name
        ),
        value
      `)
      .not('value', 'is', null) // Filter out null values
      .gt('value', 0) // Only include positive values
      .order('created_at', { ascending: false });

    if (error) {
      console.error("[getTotalContractValueByVendor] Supabase query error:", error);
      throw error;
    }

    // Process the data to calculate sums by vendor
    const vendorSums: Record<string, { name: string; total_value: number }> = {};

    // Group and sum the data manually
    data?.forEach(item => {
      // Extract vendor name from the joined data
      const vendorName = item.vendors?.name;
      if (!vendorName) return; // Skip if name is missing
      
      // Parse value to ensure it's a number
      const value = typeof item.value === 'number' ? item.value : 
                   (typeof item.value === 'string' ? parseFloat(item.value) : 0);
      
      // Initialize or update the vendor sum
      if (!vendorSums[vendorName]) {
        vendorSums[vendorName] = { name: vendorName, total_value: 0 };
      }
      vendorSums[vendorName].total_value += value;
    });

    // Convert to array, sort by total_value, and limit
    const result = Object.values(vendorSums)
      .sort((a, b) => b.total_value - a.total_value)
      .slice(0, limit);

    return result;
  });
} 