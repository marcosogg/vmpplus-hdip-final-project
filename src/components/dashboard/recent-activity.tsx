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

// Placeholder data - replace with dynamic data later
const recentActivities = [
  { id: 1, description: "Vendor 'Tech Solutions Inc.' added", timestamp: "2 hours ago" },
  { id: 2, description: "Contract 'Annual Maintenance' updated for Vendor 'ABC Corp'", timestamp: "1 day ago" },
  { id: 3, description: "Document 'NDA_signed.pdf' uploaded for Contract 'Project Phoenix'", timestamp: "2 days ago" },
  { id: 4, description: "Vendor 'Global Supplies' status changed to 'inactive'", timestamp: "3 days ago" },
  { id: 5, description: "User 'john.doe@example.com' logged in", timestamp: "4 days ago" },
];

export function RecentActivity() {
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
              A log of recent actions within the system.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-xs font-medium text-slate-500">Description</TableHead>
              <TableHead className="text-right text-xs font-medium text-slate-500">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivities.map((activity) => (
              <TableRow key={activity.id} className="hover:bg-slate-50">
                <TableCell className="py-3 font-medium text-gray-700">{activity.description}</TableCell>
                <TableCell className="py-3 text-right text-sm text-gray-500">
                  {activity.timestamp}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 