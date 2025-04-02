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
  return handleApiError(
    supabase
      .from('contracts')
      .insert({
        ...contract,
        created_by: supabase.auth.getUser().then(({ data }) => data.user?.id)
      })
      .select()
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        return data as Contract;
      })
  );
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