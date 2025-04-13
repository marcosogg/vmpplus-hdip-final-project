import { supabase } from '@/lib/supabase';
import { handleApiError } from './api-utils';
import { ApiResponse } from '@/types/api';
import { AlertTriangle, Star, CheckCircle, FileText } from 'lucide-react';

export type ActivityType = 'contract_signed' | 'document_submitted' | 'contract_expiring' | 'rating_received';

export interface Activity {
  id: string;
  type: ActivityType;
  vendor: string; // Vendor name
  time: string; // Formatted time string (e.g., "2 hours ago")
  icon: any; // Lucide icon component
  iconColor: string; // CSS class for icon color
  details?: string; // Optional details text
  timestamp: Date; // Actual timestamp for sorting
}

// Function to get recent activities from multiple tables
export async function getRecentActivities(limit: number = 5): Promise<ApiResponse<Activity[]>> {
  return handleApiError(async () => {
    try {
      // Fetch recent contracts
      const { data: recentContracts, error: contractsError } = await supabase
        .from('contracts')
        .select('id, title, vendor_id, created_at, status, end_date, vendors(name)')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (contractsError) throw contractsError;

      // Fetch recent documents (Step 1: Fetch documents without invalid join)
      const { data: recentDocuments, error: documentsError } = await supabase
        .from('documents')
        .select('id, name, entity_id, entity_type, created_at') // Removed vendors!inner(name), ensure entity_id is selected
        .eq('entity_type', 'vendor')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (documentsError) throw documentsError;

      // Step 2: Fetch associated vendor names if documents exist
      let vendorMap = new Map<string, string>();
      if (recentDocuments && recentDocuments.length > 0) {
        const vendorIds = [...new Set(recentDocuments.map(doc => doc.entity_id))]; // Get unique vendor IDs
        
        if (vendorIds.length > 0) {
          const { data: vendorsData, error: vendorsError } = await supabase
            .from('vendors')
            .select('id, name')
            .in('id', vendorIds);
            
          if (vendorsError) throw vendorsError;
          
          // Create the vendor ID to name map
          vendorsData?.forEach(v => vendorMap.set(v.id, v.name));
        }
      }

      // Combine and format activities
      const now = new Date();
      const activities: Activity[] = [];

      // Process contracts - new contracts and expiring contracts
      recentContracts?.forEach(contract => {
        // New contract activity
        if (contract.status === 'active') {
          activities.push({
            id: `contract-${contract.id}`,
            type: 'contract_signed',
            vendor: contract.vendors?.[0]?.name || 'Unknown Vendor',
            time: formatTimeAgo(new Date(contract.created_at), now),
            icon: CheckCircle,
            iconColor: 'text-green-500',
            timestamp: new Date(contract.created_at)
          });
        }
        
        // Expiring contract activity
        const endDate = new Date(contract.end_date);
        const daysToExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysToExpiry > 0 && daysToExpiry <= 30) {
          activities.push({
            id: `expiring-${contract.id}`,
            type: 'contract_expiring',
            vendor: contract.vendors?.[0]?.name || 'Unknown Vendor',
            time: formatTimeAgo(now, now), // Current time
            icon: AlertTriangle,
            iconColor: 'text-amber-500',
            details: `expires in ${daysToExpiry} days`,
            timestamp: now
          });
        }
      });

      // Process documents (Step 3: Use vendorMap to get vendor name)
      recentDocuments?.forEach(doc => {
        activities.push({
          id: `document-${doc.id}`,
          type: 'document_submitted',
          vendor: vendorMap.get(doc.entity_id) || 'Unknown Vendor', // Use the map here
          time: formatTimeAgo(new Date(doc.created_at), now),
          icon: FileText,
          iconColor: 'text-blue-500',
          timestamp: new Date(doc.created_at)
        });
      });

      // Sort activities by timestamp (most recent first)
      activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      // Return the most recent activities up to the limit
      return activities.slice(0, limit);
    } catch (error) {
      console.error("Error fetching activities:", error);
      // Return mock data as fallback
      return getMockActivities();
    }
  });
}

// Helper function to format time ago
function formatTimeAgo(date: Date, now: Date): string {
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week ago';
  if (weeks < 4) return `${weeks} weeks ago`;
  
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;
  
  const years = Math.floor(days / 365);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

// Fallback mock data
function getMockActivities(): Activity[] {
  return [
    {
      id: "1",
      type: "contract_signed",
      vendor: "Amazon Web Services",
      time: "2 hours ago",
      icon: CheckCircle,
      iconColor: "text-green-500",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: "2",
      type: "document_submitted",
      vendor: "IBM Solutions",
      time: "5 hours ago",
      icon: FileText,
      iconColor: "text-blue-500",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      id: "3",
      type: "contract_expiring",
      vendor: "FedEx Logistics",
      time: "Yesterday",
      icon: AlertTriangle,
      iconColor: "text-amber-500",
      details: "expires in 30 days",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: "4",
      type: "rating_received",
      vendor: "Adobe Systems",
      time: "2 days ago",
      icon: Star,
      iconColor: "text-purple-500",
      details: "received a 5-star rating",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  ];
} 