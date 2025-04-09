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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Recent Vendors</CardTitle>
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
                index < recentVendors.length - 1 ? "border-b" : ""
              )}
            >
              {/* Left: Logo, Name, Category */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={vendor.logoUrl} alt={`${vendor.name} logo`} />
                  <AvatarFallback>{getInitials(vendor.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm text-card-foreground">{vendor.name}</p>
                  <p className="text-xs text-muted-foreground">{vendor.category}</p>
                </div>
              </div>

              {/* Middle Section (Status, Contracts, Rating) */}
              <div className="flex items-center gap-6 sm:gap-8 md:gap-12 flex-grow justify-end mr-4">
                {/* Status Badge */}
                <Badge
                  variant={vendor.status === 'Active' ? 'outline' : 'outline'}
                  className={cn(
                    "text-xs px-2 py-0.5",
                    vendor.status === 'Active'
                      ? "border-green-300 text-green-700 bg-green-50"
                      : "border-yellow-300 text-yellow-700 bg-yellow-50"
                  )}
                >
                  {vendor.status}
                </Badge>

                {/* Contracts */}
                <p className="text-sm text-muted-foreground min-w-[70px] text-right">{vendor.contracts}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 min-w-[50px]">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-card-foreground">{vendor.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Right: Button */}
              <Button variant="outline" size="sm" className="flex-shrink-0">
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