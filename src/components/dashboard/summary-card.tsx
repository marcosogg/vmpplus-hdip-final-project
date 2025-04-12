import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

// Define color types for stricter prop validation
// type ChangeColor = 'green' | 'red';
type IconColorClass = `text-${string}-${number}`; // e.g., text-blue-600
type IconBgColorClass = `bg-${string}-${number}`; // e.g., bg-blue-100

interface SummaryCardProps {
  title: string;
  value: string;
  change: string;
  // changeColor: ChangeColor;
  icon: React.ElementType; // Lucide icon component
  iconColor: string;
  iconBgColor: string;
  isUrgent?: boolean; // Keep optional prop for urgent badge
}

export function SummaryCard({
  title,
  value,
  change,
  // changeColor,
  icon: Icon, // Rename prop for clarity
  iconColor,
  iconBgColor,
  isUrgent = false, // Default to false
}: SummaryCardProps) {
  // const changeTextColor = changeColor === 'green' ? 'text-green-600' : 'text-red-600';

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-3xl font-bold mt-1">{value}</h3>
            <div className="flex items-center mt-1 text-sm">
              {!isUrgent ? (
                <>
                  <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                  <span className="text-green-600">{change}</span>
                </>
              ) : (
                <>
                  <span className="text-red-600">{change}</span>
                  <Badge variant="destructive" className="ml-2 text-[10px] py-0">
                    urgent
                  </Badge>
                </>
              )}
            </div>
          </div>
          <div className={`h-12 w-12 ${iconBgColor} rounded-full flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Keep default export if it exists, or remove if not needed elsewhere
// export default SummaryCard; 