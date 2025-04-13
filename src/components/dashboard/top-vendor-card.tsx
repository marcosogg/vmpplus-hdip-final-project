import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Vendor } from '@/lib/api/vendors';
import { Skeleton } from '@/components/ui/skeleton';

interface TopVendorCardProps {
  vendor: Vendor | null;
  isLoading: boolean;
  error: string | null;
  title?: string;
}

// Helper to get initials for AvatarFallback
const getInitials = (name: string | null | undefined) => {
  if (typeof name !== 'string' || name.trim().length === 0) {
    return '?';
  }
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
};

export function TopVendorCard({ vendor, isLoading, error, title = "Top Vendor" }: TopVendorCardProps) {

  // Loading State
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-5 w-3/4 mb-1" />
          <Skeleton className="h-4 w-1/2 mb-3" />
          <Skeleton className="h-4 w-1/3 mb-4" />
          <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-7 w-16 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error State
  if (error) {
    return (
      <Card className="bg-white rounded-lg shadow-sm border border-red-200 overflow-hidden">
        <CardContent className="p-4 text-center text-red-600 flex flex-col items-center justify-center gap-2 h-full">
          <AlertCircle className="h-6 w-6" />
          <p className="font-medium">{title}</p>
          <span>Error: {error}</span>
        </CardContent>
      </Card>
    );
  }

  // No Vendor State
  if (!vendor) {
     return (
      <Card className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <CardContent className="p-4 text-center text-gray-500 flex flex-col items-center justify-center gap-2 h-full">
          <p className="font-medium">{title}</p>
          <span>No vendor data available.</span>
        </CardContent>
      </Card>
    );
  }

  // Success State - Render Vendor Details
  // Assuming Vendor type has fields like name, category, status, logo_url
  // The original component used rating and contractCount which might not be directly on the Vendor type. 
  // We'll omit these for now or assume default values.
  const safeRating = 0; // Placeholder - rating not on Vendor type
  const contractCount = 0; // Placeholder - contract count not directly on Vendor type
  const vendorStatus = vendor.status || 'unknown'; // Handle potential null status

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <Avatar className="h-10 w-10">
              <AvatarImage src={vendor.logo_url || undefined} alt={`${vendor.name} logo`} />
              <AvatarFallback>{getInitials(vendor.name)}</AvatarFallback>
           </Avatar>
           <Badge
              variant="outline"
              className={cn(
                  "text-xs px-2.5 py-0.5 rounded-full font-medium border-0 capitalize",
                  vendorStatus === 'active'
                      ? "bg-green-100 text-green-800"
                      : vendorStatus === 'pending'
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
              )}
            >
              {vendorStatus}
            </Badge>
        </div>

          <p className="font-semibold text-base text-gray-900 mb-0.5">{vendor.name}</p>
          <p className="text-sm text-gray-500 mb-3">{vendor.category}</p>

          {/* Removed Rating display as it's likely not part of Vendor type */}
          {/* 
          <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (...))}
              <span className="text-sm font-medium text-gray-700 ml-1">{safeRating.toFixed(1)}</span>
          </div> 
          */}

          <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
              {/* Removed Contract Count display */}
              {/* <span className="text-sm text-gray-500">{contractCount} contract{contractCount !== 1 ? 's' : ''}</span> */}
              <span className="text-sm text-gray-500">Status: {vendorStatus}</span> {/* Show status instead */} 
              <Button variant="outline" size="sm" className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 px-3 py-1 text-xs font-medium">
                  Details
              </Button>
          </div>
      </CardContent>
    </Card>
  );
}

export default TopVendorCard; 