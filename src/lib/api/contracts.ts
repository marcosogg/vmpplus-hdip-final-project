import { supabase } from '@/lib/supabase';
import { handleApiError } from './api-utils';
import { ApiResponse } from '@/types/api';
import { Contract, ContractInsert, ContractUpdate, ContractWithVendor } from '@/types/contract';

// Get all contracts
export async function getContracts(): Promise<ApiResponse<ContractWithVendor[]>> {
  return handleApiError(
    supabase
      .from('contracts')
      .select('*, vendors(name)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        return data as ContractWithVendor[];
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
export async function getContractById(id: string): Promise<ApiResponse<ContractWithVendor>> {
  return handleApiError(
    supabase
      .from('contracts')
      .select('*, vendors(name)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        return data as ContractWithVendor;
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
      vendor_id: contract.vendor_id,
      description: contract.description,
      start_date: contract.start_date,
      end_date: contract.end_date,
      value: contract.value,
      status: contract.status,
      created_by: userId
    };

    const { data, error } = await supabase
      .from('contracts')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("[createContract] Supabase insert error details:", error);
      throw error;
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