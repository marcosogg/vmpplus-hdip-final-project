import { Database } from './supabase';

export type ActivityLog = Database['public']['Tables']['activity_log']['Row'];
export type ActivityLogInsert = Database['public']['Tables']['activity_log']['Insert'];
export type ActivityLogUpdate = Database['public']['Tables']['activity_log']['Update'];

export enum ActivityType {
  VENDOR_CREATED = 'VENDOR_CREATED',
  VENDOR_UPDATED = 'VENDOR_UPDATED',
  VENDOR_DELETED = 'VENDOR_DELETED',
  CONTRACT_CREATED = 'CONTRACT_CREATED',
  CONTRACT_UPDATED = 'CONTRACT_UPDATED',
  CONTRACT_DELETED = 'CONTRACT_DELETED',
  CONTRACT_EXPIRING = 'CONTRACT_EXPIRING',
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  DOCUMENT_DELETED = 'DOCUMENT_DELETED',
  VENDOR_RATED = 'VENDOR_RATED'
}

export interface ActivityMetadata {
  days_until_expiry?: number;
  rating?: number;
  previous_status?: string;
  new_status?: string;
  [key: string]: any;
}

export interface ActivityFeedItem extends ActivityLog {
  vendor?: {
    name: string;
  } | null;
  contract?: {
    title: string;
    vendor_name: string;
  } | null;
  document?: {
    name: string;
  } | null;
  user?: {
    full_name: string | null;
  } | null;
} 