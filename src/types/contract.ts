import { Database } from './supabase';

// Base contract type from Supabase
export type Contract = Database['public']['Tables']['contracts']['Row'];
export type ContractInsert = Database['public']['Tables']['contracts']['Insert'];
export type ContractUpdate = Database['public']['Tables']['contracts']['Update'];

// Extended contract type that includes vendor name
export interface ContractWithVendor extends Contract {
  vendors: {
    name: string;
  } | null;
}

// Contract status type
export type ContractStatus = 'draft' | 'active' | 'completed' | 'terminated';

// Validate contract status
export function isValidContractStatus(status: string): status is ContractStatus {
  return ['draft', 'active', 'completed', 'terminated'].includes(status);
}

// Helper to ensure contract has vendor data
export function hasVendorData(contract: Contract | ContractWithVendor): contract is ContractWithVendor {
  return 'vendors' in contract && contract.vendors !== undefined;
}

// Format contract value as currency
export function formatContractValue(value: number): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
} 