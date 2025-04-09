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
    <Card>
      <CardContent className="p-4 flex flex-col">
          {/* Top Right Badge */}
          <div className="flex justify-end mb-2">
              <Badge
                  variant="outline"
                  className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      status === 'Active'
                          ? "border-green-200 text-green-800 bg-green-100"
                          : "border-yellow-200 text-yellow-800 bg-yellow-100"
                  )}
              >
                  {status}
              </Badge>
          </div>

          {/* Logo */}
           <Avatar className="h-10 w-10 mb-2">
              <AvatarImage src={logoUrl} alt={`${name} logo`} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
           </Avatar>

          {/* Text Info */}
          <p className="font-semibold text-base text-card-foreground mt-1">{name}</p>
          <p className="text-sm text-muted-foreground mb-2">{category}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
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
              <span className="text-sm font-medium text-card-foreground ml-1">{safeRating.toFixed(1)}</span>
          </div>

          {/* Bottom Section */}
          <div className="flex justify-between items-center mt-auto pt-3 border-t">
              <span className="text-sm text-muted-foreground">{contractCount} contract{contractCount !== 1 ? 's' : ''}</span>
              <Button variant="link" className="p-0 h-auto text-sm font-medium text-primary">
                  Details
              </Button>
          </div>
      </CardContent>
    </Card>
  );
}

export default TopVendorCard; 