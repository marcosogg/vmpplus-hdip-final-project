import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity } from 'lucide-react';

interface RecentActivityProps {
  recentVendors: Array<{
    id: string;
    name: string;
    created_at: string;
  }>;
  recentContracts: Array<{
    id: string;
    title: string;
    vendor_name: string;
    created_at: string;
  }>;
}

export function RecentActivity({ recentVendors, recentContracts }: RecentActivityProps) {
  // Combine and sort activities by date
  const activities = [
    ...recentVendors.map(vendor => ({
      id: `vendor-${vendor.id}`,
      description: `New vendor '${vendor.name}' added`,
      timestamp: new Date(vendor.created_at),
      type: 'vendor' as const
    })),
    ...recentContracts.map(contract => ({
      id: `contract-${contract.id}`,
      description: `New contract '${contract.title}' created for ${contract.vendor_name}`,
      timestamp: new Date(contract.created_at),
      type: 'contract' as const
    }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Function to format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="overflow-hidden">
      {/* Add subtle blue gradient top border like landing page cards */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-blue-400"></div>
      
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-gray-800">Recent Activity</CardTitle>
            <CardDescription className="text-gray-500">
              Latest vendors and contracts added to the system
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {activities.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No recent activity to display
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-xs font-medium text-slate-500">Description</TableHead>
                <TableHead className="text-right text-xs font-medium text-slate-500">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id} className="hover:bg-slate-50">
                  <TableCell className="py-3 font-medium text-gray-700">{activity.description}</TableCell>
                  <TableCell className="py-3 text-right text-sm text-gray-500">
                    {formatRelativeTime(activity.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 