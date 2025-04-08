import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface TopVendorCardProps {
  vendor: {
    id: string;
    name: string;
    category: string;
    status: "active" | "pending";
    rating: number;
    contracts: number;
    avatar: string;
  };
}

export function TopVendorCard({ vendor }: TopVendorCardProps) {
  return (
    <Card className="overflow-hidden">
      {/* Add subtle blue gradient top border like landing page cards */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-blue-400"></div>
      
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-4">
          {/* Avatar */}
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg font-medium">
              {vendor.avatar}
            </AvatarFallback>
          </Avatar>

          {/* Vendor Info */}
          <div className="text-center">
            <h3 className="text-lg font-semibold">{vendor.name}</h3>
            <p className="text-sm text-muted-foreground">{vendor.category}</p>
          </div>

          {/* Status Badge */}
          <Badge variant={vendor.status === "active" ? "default" : "secondary"}>
            {vendor.status}
          </Badge>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="font-medium">{vendor.rating}</span>
          </div>

          {/* Contract Count */}
          <div className="text-sm text-muted-foreground">
            {vendor.contracts} active contracts
          </div>

          {/* Details Button */}
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link to={`/app/vendors/${vendor.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 