import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Users, AlertTriangle, CheckCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Vendor } from '@/lib/api/vendors';
import { Contract } from '@/lib/api/contracts';

type ActivityFeedItem = (Vendor & { type: 'vendor' }) | (Contract & { type: 'contract' });

interface RecentActivityProps {
  activities: ActivityFeedItem[] | null;
  isLoading: boolean;
  error: string | null;
}

const formatTimestamp = (timestamp: string | null | undefined): string => {
  if (!timestamp) return 'Unknown time';
  const date = new Date(timestamp);
  const now = new Date();
  const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export function RecentActivity({ activities, isLoading, error }: RecentActivityProps) {

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 p-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 text-center text-red-600 flex items-center justify-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Error loading activities: {error.split(';')[0]}</span>
        </div>
      );
    }

    if (!activities || activities.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No recent activity found.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const timestamp = formatTimestamp(activity.created_at);
          let icon;
          let description: React.ReactNode;

          if (activity.type === 'vendor') {
            // New vendor added
            icon = <Users className="h-5 w-5 text-blue-500" />;
            description = (
              <>
                New vendor added: <span className="font-medium">{activity.name || 'Unknown Vendor'}</span>
              </>
            );
          } else if (activity.type === 'contract') {
            // For contracts, determine if it's a new contract, expiring, or document submitted
            if (activity.status === 'active' || activity.status === 'pending') {
              // New contract signed
              icon = <CheckCircle className="h-5 w-5 text-green-500" />;
              description = (
                <>
                  New contract signed with <span className="font-medium">{activity.vendor_name || 'Unknown Vendor'}</span>
                </>
              );
            } else if (activity.status === 'expired' || 
                     (activity.end_date && new Date(activity.end_date).getTime() < new Date().getTime() + 30 * 24 * 60 * 60 * 1000)) {
              // Contract expiring or expired
              icon = <AlertTriangle className="h-5 w-5 text-amber-500" />;
              description = (
                <>
                  Contract with <span className="font-medium">{activity.vendor_name || 'Unknown Vendor'}</span> expires in 30 days
                </>
              );
            } else {
              // Default contract activity (document submitted)
              icon = <FileText className="h-5 w-5 text-blue-500" />;
              description = (
                <>
                  Vendor <span className="font-medium">{activity.vendor_name || 'Unknown Vendor'}</span> submitted documents for review
                </>
              );
            }
          } else {
            // Fallback for unknown activity types
            icon = <FileText className="h-5 w-5 text-gray-500" />;
            description = "Unknown activity";
          }

          return (
            <div
              key={`${activity.type}-${activity.id}`}
              className="flex items-start gap-3 p-3"
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1">
                <p className="text-gray-900">{description}</p>
                <p className="text-sm text-gray-500">{timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Recent Activities</CardTitle>
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

export default RecentActivity; 