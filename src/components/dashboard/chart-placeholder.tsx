import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChartHorizontal } from 'lucide-react';

interface ChartPlaceholderProps {
  title?: string;
  description?: string;
}

export function ChartPlaceholder({ 
  title = "Chart Data", 
  description = "Visual representation unavailable." 
}: ChartPlaceholderProps) {
  // <ai_context>
  // Use shadcn/ui Card as the container
  // Display a simple visual placeholder (e.g., gray box)
  // Accept optional title and description props
  // Added an icon to the CardHeader for visual consistency.
  // </ai_context>
  return (
    <Card className="overflow-hidden">
      {/* Add subtle blue gradient top border like landing page cards */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-blue-400"></div>
      
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <BarChartHorizontal className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-gray-800">{title}</CardTitle>
            <CardDescription className="text-gray-500">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-6">
        <div className="h-[200px] w-full rounded-md border border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-6">
          <div className="w-full flex justify-between mb-2">
            <div className="h-16 w-12 rounded bg-blue-200 opacity-70"></div>
            <div className="h-24 w-12 rounded bg-blue-300 opacity-70"></div>
            <div className="h-20 w-12 rounded bg-blue-200 opacity-70"></div>
            <div className="h-28 w-12 rounded bg-blue-400 opacity-70"></div>
            <div className="h-16 w-12 rounded bg-blue-200 opacity-70"></div>
          </div>
          <p className="text-sm text-gray-400 mt-4">Placeholder Chart Data</p>
        </div>
      </CardContent>
    </Card>
  );
} 