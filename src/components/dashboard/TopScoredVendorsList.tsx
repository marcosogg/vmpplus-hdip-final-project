import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Star } from 'lucide-react'; // Import Star icon
import { Vendor } from '@/lib/api/vendors'; // Import Vendor type
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // For View All button

interface TopScoredVendorsListProps {
  vendors: Vendor[] | null;
  isLoading: boolean;
  error: string | null;
  limit?: number; // Optional limit to show only a certain number
}

// Helper function to get initials for avatar fallback
const getInitials = (name: string) => {
  if (!name) return '??';
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
};

export function TopScoredVendorsList({ vendors, isLoading, error, limit }: TopScoredVendorsListProps) {

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(limit || 4)].map((_, i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-500 text-center py-4 flex items-center justify-center gap-2">
           <AlertTriangle className="h-5 w-5" />
           <span>Error: {error.split(';')[0]}</span>
        </div>
      );
    }

    if (!vendors || vendors.length === 0) {
      return (
        <div className="text-gray-500 text-center py-4">
          No scored vendors found.
        </div>
      );
    }

    const displayVendors = limit ? vendors.slice(0, limit) : vendors;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayVendors.map((vendor) => (
          <div key={vendor.id} className="bg-white border border-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <Avatar className="h-12 w-12 bg-gray-100">
                <AvatarImage src={vendor.logo_url || undefined} alt={vendor.name || 'Vendor'} />
                <AvatarFallback>{getInitials(vendor.name || '')}</AvatarFallback>
              </Avatar>
              <Badge
                className={cn(
                  "rounded-md px-2 py-0.5 text-xs font-medium",
                  vendor.status === 'active'
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                )}
              >
                {(vendor.status ? vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1) : 'Unknown')}
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{vendor.name || 'Unknown Vendor'}</h3>
            <p className="text-sm text-gray-500 mb-3">{vendor.category || 'Unknown Category'}</p>
            <div className="flex items-center mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      vendor.score && i < Math.floor(vendor.score)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm font-medium">
                {vendor.score ? vendor.score.toFixed(1) : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {vendor.contract_count || 0} {(vendor.contract_count === 1) ? 'contract' : 'contracts'}
              </span>
              <Button variant="outline" size="sm" className="text-sm">
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Top Rated Vendors</CardTitle>
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

export default TopScoredVendorsList; 