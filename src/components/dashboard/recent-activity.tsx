import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FilePenLine, CheckCircle, AlertTriangle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: number;
  icon: React.ElementType;
  iconBg: string; // bg-blue-100 etc.
  iconColor: string; // text-blue-600 etc.
  descriptionParts: (string | { text: string; bold: boolean })[]; // Use bold flag
  timestamp: string;
}

// Mock Data with parsed description using bold flag
const recentActivities: Activity[] = [
  { id: 1, icon: FilePenLine, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', descriptionParts: ['New contract signed with ', { text: 'Amazon Web Services', bold: true }, '.'], timestamp: '2 hours ago' },
  { id: 2, icon: CheckCircle, iconBg: 'bg-green-100', iconColor: 'text-green-600', descriptionParts: ['Vendor ', { text: 'IBM Solutions', bold: true }, ' submitted documents for review.'], timestamp: '5 hours ago' },
  { id: 3, icon: AlertTriangle, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', descriptionParts: ['Contract with ', { text: 'FedEx Logistics', bold: true }, ' expires in 30 days.'], timestamp: 'Yesterday' },
  { id: 4, icon: Star, iconBg: 'bg-purple-100', iconColor: 'text-purple-600', descriptionParts: [{ text: 'Adobe Systems', bold: true }, ' received a 5-star rating.'], timestamp: '2 days ago' },
];

export function RecentActivity() {
  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-medium text-gray-700">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {recentActivities.map((activity, index) => (
            <div 
              key={activity.id} 
              className={cn(
                "flex items-start gap-3 p-4",
                index < recentActivities.length - 1 ? "border-b border-gray-100" : ""
              )}
            >
              <div className={cn("p-2 rounded-full flex items-center justify-center", activity.iconBg)}>
                <activity.icon className={cn("h-4 w-4", activity.iconColor)} />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-700">
                  {activity.descriptionParts.map((part, i) =>
                    typeof part === 'string' ? (
                      <React.Fragment key={i}>{part}</React.Fragment>
                    ) : (
                      <span key={i} className={cn(part.bold ? 'font-medium text-gray-900' : '')}>{part.text}</span>
                    )
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentActivity; 