import { supabase } from '@/lib/supabase';
import { handleApiError } from './api-utils';
import { ApiResponse } from '@/types/api';
import { ActivityLog, ActivityLogInsert, ActivityFeedItem } from '@/types/activity';

// Basic type for fetched activity log entry
export type ActivityLog = {
  id: string;
  created_at: string;
  activity_type: string;
  description: string;
  user_id: string | null;
  vendor_id: string | null;
  contract_id: string | null;
  document_id: string | null;
  metadata: Record<string, any> | null;
};

export enum ActivityType {
  // Vendor activities
  VENDOR_CREATED = 'vendor_created',
  VENDOR_UPDATED = 'vendor_updated',
  VENDOR_DELETED = 'vendor_deleted',
  VENDOR_RATED = 'vendor_rated',
  
  // Contract activities
  CONTRACT_CREATED = 'contract_created',
  CONTRACT_UPDATED = 'contract_updated',
  CONTRACT_DELETED = 'contract_deleted',
  CONTRACT_EXPIRING = 'contract_expiring',
  
  // Document activities
  DOCUMENT_UPLOADED = 'document_uploaded',
  DOCUMENT_DELETED = 'document_deleted',
  
  // User activities
  PROFILE_CREATED = 'profile_created',
  PROFILE_UPDATED = 'profile_updated'
}

export type ActivityMetadata = Record<string, any>;

/**
 * Logs a new activity
 */
export async function logActivity(
  activity: Omit<ActivityLogInsert, 'id' | 'created_at'>
): Promise<ApiResponse<ActivityLog>> {
  return handleApiError(
    supabase
      .from('activity_log')
      .insert(activity)
      .select()
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        return data as ActivityLog;
      })
  );
}

/**
 * Fetches recent activities from the activity_log table
 * @param limit Maximum number of activities to return
 * @returns Promise containing the recent activities
 */
export async function getRecentActivities(limit: number): Promise<ApiResponse<ActivityLog[]>> {
  return handleApiError(
    supabase
      .from('activity_log')
      .select(`
        id,
        created_at,
        activity_type,
        description,
        user_id,
        vendor_id,
        contract_id,
        document_id,
        metadata
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
      .then(({ data, error }) => {
        if (error) throw error;
        return (data as ActivityLog[]) || [];
      })
  );
}

/**
 * Gets activities for a specific vendor
 */
export async function getVendorActivities(
  vendorId: string,
  limit: number = 10,
  offset: number = 0
): Promise<ApiResponse<ActivityFeedItem[]>> {
  return handleApiError(
    supabase
      .from('activity_log')
      .select(`
        *,
        vendor:vendor_id(name),
        contract:contract_id(title, vendors(name)),
        document:document_id(name),
        user:user_id(full_name)
      `)
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
      .then(({ data, error }) => {
        if (error) throw error;
        return data as ActivityFeedItem[];
      })
  );
}

/**
 * Gets activities for a specific contract
 */
export async function getContractActivities(
  contractId: string,
  limit: number = 10,
  offset: number = 0
): Promise<ApiResponse<ActivityFeedItem[]>> {
  return handleApiError(
    supabase
      .from('activity_log')
      .select(`
        *,
        vendor:vendor_id(name),
        contract:contract_id(title, vendors(name)),
        document:document_id(name),
        user:user_id(full_name)
      `)
      .eq('contract_id', contractId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
      .then(({ data, error }) => {
        if (error) throw error;
        return data as ActivityFeedItem[];
      })
  );
}

// Base function to log any activity
async function logActivityBase(
  type: ActivityType,
  entityId: string,
  description: string,
  metadata: ActivityMetadata = {}
): Promise<ApiResponse<null>> {
  return handleApiError(async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) throw authError;
    if (!user) throw new Error('No authenticated user');

    const { error } = await supabase
      .from('activities')
      .insert({
        type,
        entity_id: entityId,
        description,
        metadata,
        user_id: user.id
      });

    if (error) throw error;
    return null;
  });
}

// Vendor-specific logging
export async function logVendorActivity(
  type: ActivityType,
  vendorId: string,
  description: string,
  metadata: ActivityMetadata = {}
): Promise<ApiResponse<null>> {
  return logActivityBase(type, vendorId, description, metadata);
}

// Contract-specific logging
export async function logContractActivity(
  type: ActivityType,
  contractId: string,
  description: string,
  metadata: ActivityMetadata = {}
): Promise<ApiResponse<null>> {
  return logActivityBase(type, contractId, description, metadata);
}

// Document-specific logging
export async function logDocumentActivity(
  type: ActivityType,
  documentId: string,
  description: string,
  metadata: ActivityMetadata = {}
): Promise<ApiResponse<null>> {
  return logActivityBase(type, documentId, description, metadata);
}

// User-specific logging
export async function logUserActivity(
  type: ActivityType,
  userId: string,
  description: string,
  metadata: ActivityMetadata = {}
): Promise<ApiResponse<null>> {
  return logActivityBase(type, userId, description, metadata);
} 