import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
}

export function SummaryCard({
  title,
  value,
  change,
  changeColor,
  icon: Icon, // Rename prop for clarity
  iconColor,
  iconBgColor,
}: SummaryCardProps) {
  const changeTextColor = changeColor === 'green' ? 'text-green-500' : 'text-red-500';

  return (
    <Card className="bg-white rounded-lg shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            <p className={cn('text-sm mt-1', changeTextColor)}>{change}</p>
          </div>
          <div className={cn('p-3 rounded-full', iconBgColor)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SummaryCard; 