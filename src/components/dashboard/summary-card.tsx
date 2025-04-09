import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Define color types for stricter prop validation
type ChangeColor = 'green' | 'red';
type IconColorClass = `text-${string}-${number}`; // e.g., text-blue-600
type IconBgColorClass = `bg-${string}-${number}`; // e.g., bg-blue-100

interface SummaryCardProps {
  title: string;
  value: string;
  change: string;
  changeColor: ChangeColor;
  icon: React.ElementType; // Lucide icon component
  iconColor: IconColorClass;
  iconBgColor: IconBgColorClass;
  isUrgent?: boolean; // Add optional prop for urgent badge
}

export function SummaryCard({
  title,
  value,
  change,
  changeColor,
  icon: Icon, // Rename prop for clarity
  iconColor,
  iconBgColor,
  isUrgent = false, // Default to false
}: SummaryCardProps) {
  const changeTextColor = changeColor === 'green' ? 'text-green-600' : 'text-red-600'; // Adjusted colors slightly

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={cn('p-3 rounded-full', iconBgColor)}>
            <Icon className={cn('h-6 w-6', iconColor)} />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
            <div className="flex items-center justify-end space-x-2">
              <p className={cn('text-xs', changeTextColor)}>{change}</p>
              {isUrgent && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0.5">urgent</Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SummaryCard; 