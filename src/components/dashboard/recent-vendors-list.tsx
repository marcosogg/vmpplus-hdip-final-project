import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Data (replace logoUrl with actual paths or use fallbacks)
const recentVendors = [
  { id: 1, logoUrl: 'https://logo.clearbit.com/amazon.com', name: 'Amazon Web Services', category: 'Cloud Services', status: 'Active', contracts: '5 contracts', rating: 4.7 },
  { id: 2, logoUrl: 'https://logo.clearbit.com/fedex.com', name: 'FedEx Logistics', category: 'Shipping', status: 'Active', contracts: '3 contracts', rating: 4.2 },
  { id: 3, logoUrl: 'https://logo.clearbit.com/ibm.com', name: 'IBM Solutions', category: 'IT Services', status: 'Pending', contracts: '1 contract', rating: 4.5 },
];

// Helper to get initials for AvatarFallback
const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
};

export function RecentVendorsList() {
  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-lg font-medium text-gray-700">Recent Vendors</CardTitle>
        <Button variant="link" className="p-0 h-auto text-sm font-medium text-primary">
          View All
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {recentVendors.map((vendor, index) => (
            <div
              key={vendor.id}
              className={cn(
                "flex items-center justify-between gap-4 p-4",
                index < recentVendors.length - 1 ? "border-b border-gray-100" : ""
              )}
            >
              <div className="flex items-center gap-3 flex-shrink-0 min-w-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={vendor.logoUrl} alt={`${vendor.name} logo`} />
                  <AvatarFallback>{getInitials(vendor.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{vendor.name}</p>
                  <p className="text-xs text-gray-500 truncate">{vendor.category}</p>
                </div>
              </div>

              <div className="flex-shrink-0 mx-4">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs px-2.5 py-0.5 rounded-full font-medium border-0",
                    vendor.status === 'Active'
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  )}
                >
                  {vendor.status}
                </Badge>
              </div>

              <Button variant="outline" size="sm" className="flex-shrink-0 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 px-3 py-1 text-xs font-medium">
                View Details
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentVendorsList; 