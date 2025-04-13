import { supabase } from '@/lib/supabase';
import { handleApiError } from './api-utils';
import { ApiResponse } from '@/types/api';
import { Database } from '@/types/supabase';

export type Contract = Database['public']['Tables']['contracts']['Row'];
export type ContractInsert = Database['public']['Tables']['contracts']['Insert'];
export type ContractUpdate = Database['public']['Tables']['contracts']['Update'];

// Get all contracts
export async function getContracts(): Promise<ApiResponse<Contract[]>> {
  return handleApiError(async () => {
    const { data, error } = await supabase
      .from('contracts')
      .select('*, vendors(name, logo_url)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as unknown as Contract[];
  });
}

// Get contracts for a specific vendor
export async function getContractsByVendorId(vendorId: string): Promise<ApiResponse<Contract[]>> {
  return handleApiError(async () => {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Contract[];
  });
}

// Get a single contract by ID
export async function getContractById(id: string): Promise<ApiResponse<Contract>> {
  return handleApiError(async () => {
    const { data, error } = await supabase
      .from('contracts')
      .select('*, vendors(name, logo_url)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as unknown as Contract;
  });
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
  return handleApiError(async () => {
    const { data, error } = await supabase
      .from('contracts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Contract;
  });
}

// Delete a contract
export async function deleteContract(id: string): Promise<ApiResponse<null>> {
  return handleApiError(async () => {
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return null;
  });
}

// Get total count of contracts
export async function getContractCount(): Promise<ApiResponse<number>> {
  return handleApiError(async () => {
    const { count, error } = await supabase
      .from('contracts')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  });
}

// Get count of contracts expiring soon (within 30 days)
export async function getExpiringContractCount(): Promise<ApiResponse<number>> {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  return handleApiError(async () => {
    const { count, error } = await supabase
      .from('contracts')
      .select('*', { count: 'exact', head: true })
      .lte('end_date', thirtyDaysFromNow.toISOString())
      .gt('end_date', new Date().toISOString());
    
    if (error) throw error;
    return count || 0;
  });
}

// Get count of urgent contracts
export async function getUrgentContractCount(): Promise<ApiResponse<number>> {
  return handleApiError(async () => {
    const { count, error } = await supabase
      .from('contracts')
      .select('*', { count: 'exact', head: true })
      .eq('is_urgent', true);
    
    if (error) throw error;
    return count || 0;
  });
} 