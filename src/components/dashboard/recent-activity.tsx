import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Users, AlertTriangle, CheckCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ActivityLog } from '@/lib/api/activity';

interface RecentActivityProps {
  activities: ActivityLog[] | null;
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
        {activities.map((activity) => {
          const timestamp = formatTimestamp(activity.created_at);
          let icon;
          let description: React.ReactNode;

          // Determine icon and description based on activity type
          switch (activity.activity_type) {
            case 'vendor_created':
            case 'vendor_updated':
            case 'vendor_deleted':
              icon = <Users className="h-5 w-5 text-blue-500" />;
              description = activity.description;
              break;
            case 'vendor_rated':
              icon = <Star className="h-5 w-5 text-purple-500" />;
              description = activity.description;
              break;
            case 'contract_created':
            case 'contract_updated':
            case 'contract_deleted':
              icon = <CheckCircle className="h-5 w-5 text-green-500" />;
              description = activity.description;
              break;
            case 'contract_expiring':
              icon = <AlertTriangle className="h-5 w-5 text-amber-500" />;
              description = activity.description;
              break;
            case 'document_uploaded':
            case 'document_deleted':
              icon = <FileText className="h-5 w-5 text-blue-500" />;
              description = activity.description;
              break;
            case 'profile_created':
            case 'profile_updated':
              icon = <Users className="h-5 w-5 text-purple-500" />;
              description = activity.description;
              break;
            default:
              icon = <FileText className="h-5 w-5 text-gray-500" />;
              description = activity.description;
          }

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-gray-100">{description || 'No description available'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{timestamp}</p>
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