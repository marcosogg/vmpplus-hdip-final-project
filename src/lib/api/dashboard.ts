import { supabase } from '@/lib/supabase';
import { handleApiError } from './api-utils';
import { ApiResponse } from '@/types/api';

export interface DashboardStats {
  totalVendors: number;
  activeContracts: number;
  totalDocuments: number;
  recentVendors: Array<{
    id: string;
    name: string;
    created_at: string;
  }>;
  recentContracts: Array<{
    id: string;
    title: string;
    vendor_name: string;
    created_at: string;
  }>;
}

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return handleApiError(async () => {
    // Get total vendors count
    const { count: vendorCount, error: vendorError } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true });

    if (vendorError) throw vendorError;

    // Get active contracts count
    const { count: contractCount, error: contractError } = await supabase
      .from('contracts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (contractError) throw contractError;

    // Get total documents count
    const { count: documentCount, error: documentError } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true });

    if (documentError) throw documentError;

    // Get 5 most recent vendors
    const { data: recentVendors, error: recentVendorsError } = await supabase
      .from('vendors')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentVendorsError) throw recentVendorsError;

    // Get 5 most recent contracts with vendor names
    const { data: recentContracts, error: recentContractsError } = await supabase
      .from('contracts')
      .select(`
        id,
        title,
        created_at,
        vendors (
          name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentContractsError) throw recentContractsError;

    return {
      totalVendors: vendorCount || 0,
      activeContracts: contractCount || 0,
      totalDocuments: documentCount || 0,
      recentVendors: recentVendors || [],
      recentContracts: (recentContracts || []).map(contract => ({
        id: contract.id,
        title: contract.title,
        vendor_name: contract.vendors?.name || 'Unknown Vendor',
        created_at: contract.created_at
      }))
    };
  });
} 