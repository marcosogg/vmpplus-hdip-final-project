import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Vendor } from '@/lib/api/vendors'; // Import Vendor type
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

// Props interface
interface RecentVendorsListProps {
  vendors: Vendor[] | null;
  isLoading: boolean;
  error: string | null;
  limit?: number; // Add optional limit prop
}

// Remove mock data
// const recentVendors = [...];

// Helper to get initials for AvatarFallback
const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
};

export function RecentVendorsList({ vendors, isLoading, error, limit }: RecentVendorsListProps) {

  const renderContent = () => {
    if (isLoading) {
      // Keep the skeleton loading state as is
      return (
        <div className="space-y-4">
          {[...Array(limit || 3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 ml-3 space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      // Keep the error state as is
      return (
        <div className="p-4 text-center text-red-600 flex items-center justify-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>Error loading vendors: {error}</span>
        </div>
      );
    }

    if (!vendors || vendors.length === 0) {
      // Keep the empty state as is
      return <div className="p-4 text-center text-gray-500">No recent vendors found.</div>;
    }

    // Apply the limit if provided
    const displayVendors = limit && vendors ? vendors.slice(0, limit) : vendors;

    return (
      // Keep the outer space-y-4 for spacing between rows
      <div className="space-y-4"> 
        {displayVendors.map((vendor) => (
          // **** START OF MODIFIED ROW ****
          <div 
            key={vendor.id} 
            // Apply target styles: flex layout, padding, background, rounded corners
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg" 
          >
            {/* Left side: Avatar and Text */}
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3"> 
                {/* Prefer logo_url if available, otherwise fallback */}
                <AvatarImage src={vendor.logo_url || undefined} alt={`${vendor.name || 'Vendor'} logo`} /> 
                <AvatarFallback>{getInitials(vendor.name || '')}</AvatarFallback>
              </Avatar>
              <div>
                 {/* Use || operator for safer fallback rendering */}
                <p className="font-medium">{vendor.name || 'Unknown Vendor'}</p> 
                <p className="text-sm text-gray-500 dark:text-gray-400">{vendor.category || 'Unknown Category'}</p> 
              </div>
            </div>
            
            {/* Right side: Badge and Button */}
            <div className="flex items-center gap-3"> 
              <Badge
                 // Use the 'success' and 'warning' variants from your updated badge.tsx
                variant={
                  vendor.status === "active" ? "success" : vendor.status === "pending" ? "warning" : "default"
                }
              >
                {/* Capitalize status */}
                {vendor.status ? vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1) : 'Unknown'} 
              </Badge>
              {/* Ensure button uses correct variant and size */}
              <Button variant="outline" size="sm"> 
                View Details
              </Button>
            </div>
          </div>
          // **** END OF MODIFIED ROW ****
        ))}
      </div>
    );
  };


  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Recent Vendors</CardTitle>
        <Button variant="link" size="sm" className="text-blue-600 font-medium">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}

export default RecentVendorsList; 