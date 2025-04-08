import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { ChartPlaceholder } from '@/components/dashboard/chart-placeholder';
import { Users, FileText, Package, PieChart } from 'lucide-react';
import { getDashboardStats, DashboardStats } from '@/lib/api/dashboard';

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardStats() {
      try {
        const { data, error } = await getDashboardStats();
        
        if (error) {
          setError(error.message);
          return;
        }
        
        setStats(data);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
        setError('An unexpected error occurred while loading dashboard data');
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 pb-8">
        <div className="space-y-2">
          <PageHeader
            title="Dashboard"
            description="Welcome to VMP Plus. Overview of your vendor management activities."
          />
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-8 pb-8">
        <div className="space-y-2">
          <PageHeader
            title="Dashboard"
            description="Welcome to VMP Plus. Overview of your vendor management activities."
          />
        </div>
        <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
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
          value={stats?.totalVendors.toString() || '0'} 
          icon={Users}
          trend={{
            value: `${stats?.recentVendors.length || 0} new this month`,
            isPositive: true
          }}
        />
        <SummaryCard 
          title="Active Contracts" 
          value={stats?.activeContracts.toString() || '0'} 
          icon={FileText}
          trend={{
            value: `${stats?.recentContracts.length || 0} new this month`,
            isPositive: true
          }}
        />
        <SummaryCard 
          title="Documents Uploaded" 
          value={stats?.totalDocuments.toString() || '0'} 
          icon={Package}
          trend={{
            value: "Recently uploaded",
            isPositive: true
          }}
        />
      </div>

      {/* Section for Recent Activity and Charts */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RecentActivity 
            recentVendors={stats?.recentVendors || []}
            recentContracts={stats?.recentContracts || []}
          />
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