import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopVendorCardProps {
  logoUrl?: string;
  name?: string;
  category?: string;
  rating?: number;
  contractCount?: number;
  status?: 'Active' | 'Pending';
}

// Helper to get initials for AvatarFallback
const getInitials = (name: string) => {
  // Add check for valid name string
  if (typeof name !== 'string' || name.trim().length === 0) {
    return '?'; // Return a default fallback if name is invalid
  }
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
};

export function TopVendorCard({
  logoUrl = '',
  name = 'Unknown Vendor',
  category = 'Uncategorized',
  rating = 0,
  contractCount = 0,
  status = 'Pending',
}: TopVendorCardProps) {
  // Safe rating value for rendering
  const safeRating = typeof rating === 'number' ? rating : 0;
  
  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <Avatar className="h-10 w-10">
              <AvatarImage src={logoUrl} alt={`${name} logo`} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
           </Avatar>
           <Badge
              variant="outline"
              className={cn(
                  "text-xs px-2.5 py-0.5 rounded-full font-medium border-0",
                  status === 'Active'
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
              )}
            >
              {status}
            </Badge>
        </div>

          <p className="font-semibold text-base text-gray-900 mb-0.5">{name}</p>
          <p className="text-sm text-gray-500 mb-3">{category}</p>

          <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                  <Star
                      key={i}
                      className={cn(
                          "h-4 w-4",
                          i < Math.round(safeRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                      )}
                  />
              ))}
              <span className="text-sm font-medium text-gray-700 ml-1">{safeRating.toFixed(1)}</span>
          </div>

          <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">{contractCount} contract{contractCount !== 1 ? 's' : ''}</span>
              <Button variant="outline" size="sm" className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 px-3 py-1 text-xs font-medium">
                  Details
              </Button>
          </div>
      </CardContent>
    </Card>
  );
}

export default TopVendorCard; 