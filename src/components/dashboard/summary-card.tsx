import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideProps } from "lucide-react"; // Assuming lucide-react is installed

interface SummaryCardProps {
  title: string;
  value: string;
  icon?: React.ComponentType<LucideProps>; // Allow passing Lucide icons
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function SummaryCard({ 
  title, 
  value, 
  icon: Icon,
  trend 
}: SummaryCardProps) {
  // <ai_context>
  // Refined layout based on landing page visual cues.
  // Icon is made larger and placed within CardContent for prominence.
  // Title remains in the header.
  // </ai_context>
  return (
    <Card className="overflow-hidden">
      {/* Add subtle blue gradient top border like landing page cards */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-blue-400"></div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="text-3xl font-bold text-gray-800">{value}</div>
        
        {/* Add trend indicator (optional) */}
        {trend && (
          <p className={`text-xs mt-1 flex items-center ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
} 