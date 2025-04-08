import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Star, Eye } from "lucide-react";

export function RecentVendorsList() {
  // Placeholder data for recent vendors
  const recentVendors = [
    {
      id: "1",
      name: "Tech Solutions Inc.",
      category: "IT Services",
      status: "active",
      contracts: 3,
      rating: 4.8,
      avatar: "TS"
    },
    {
      id: "2",
      name: "Global Logistics",
      category: "Transportation",
      status: "active",
      contracts: 2,
      rating: 4.5,
      avatar: "GL"
    },
    {
      id: "3",
      name: "Quality Supplies",
      category: "Office Supplies",
      status: "pending",
      contracts: 1,
      rating: 4.2,
      avatar: "QS"
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Vendors</CardTitle>
        <Button variant="ghost" asChild>
          <Link to="/app/vendors">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contracts</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentVendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium">
                      {vendor.avatar}
                    </div>
                    <div>
                      <div className="font-medium">{vendor.name}</div>
                      <div className="text-sm text-muted-foreground">{vendor.category}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={vendor.status === "active" ? "default" : "secondary"}>
                    {vendor.status}
                  </Badge>
                </TableCell>
                <TableCell>{vendor.contracts} active</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>{vendor.rating}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/app/vendors/${vendor.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 