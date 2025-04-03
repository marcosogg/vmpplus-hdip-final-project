import { PageHeader } from '@/components/layout/page-header';
// Remove LogoutButton import if it's included in the header via MainLayout
// import { LogoutButton } from '@/components/auth/logout-button';
import { SummaryCard } from '@/components/dashboard/summary-card'; // Import the new component
import { RecentActivity } from '@/components/dashboard/recent-activity'; // Import RecentActivity
import { ChartPlaceholder } from '@/components/dashboard/chart-placeholder'; // Import ChartPlaceholder
import { Users, FileText, Package, PieChart } from 'lucide-react'; // Add more icons if needed

export function DashboardPage() {
  // <ai_context>
  // Use PageHeader as required by frontend-rules.md Rule 9
  // Establish a grid layout for dashboard cards using Tailwind CSS
  // Integrate the SummaryCard component with placeholder data and icons
  // Remove direct LogoutButton usage if MainLayout handles it
  // Integrate RecentActivity and ChartPlaceholder into the grid layout.
  // Ensure components are correctly placed within their designated grid columns.
  // Use appropriate icons and titles for placeholders.
  // </ai_context>
  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Page Header with welcome message */}
      <div className="space-y-2">
        <PageHeader
          title="Dashboard"
          description="Welcome to VMP Plus. Overview of your vendor management activities."
        />
      </div>

      {/* Section for Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SummaryCard 
          title="Total Vendors" 
          value="24" 
          icon={Users}
          trend={{
            value: "15% from last month",
            isPositive: true
          }}
        />
        <SummaryCard 
          title="Active Contracts" 
          value="8" 
          icon={FileText}
          trend={{
            value: "3 new this month",
            isPositive: true
          }}
        />
        <SummaryCard 
          title="Documents Uploaded" 
          value="32" 
          icon={Package}
          trend={{
            value: "5 new uploads",
            isPositive: true
          }}
        />
      </div>

      {/* Section for Recent Activity and Charts */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RecentActivity />
        </div>
        <div className="lg:col-span-3">
          <ChartPlaceholder 
            title="Vendor Status Overview" 
            description="Distribution of vendor status categories"
          />
        </div>
      </div>
      
      {/* Additional Chart */}
      <div className="grid gap-6 md:grid-cols-1">
        <ChartPlaceholder 
          title="Contract Value Distribution" 
          description="Overview of contract values by category"
        />
      </div>
    </div>
  );
} 