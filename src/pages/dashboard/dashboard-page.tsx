import { PageHeader } from '@/components/layout/page-header';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { ChartPlaceholder } from '@/components/dashboard/chart-placeholder';
import { RecentVendorsList } from '@/components/dashboard/recent-vendors-list';
import { TopVendorCard } from '@/components/dashboard/top-vendor-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { Users, FileText, AlertTriangle, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getVendorCount } from '@/lib/api/vendors';
import { getContractCount, getExpiringContractCount } from '@/lib/api/contracts';
import { getDocumentCount } from '@/lib/api/documents';
import { ApiResponse } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    vendors: 0,
    contracts: 0,
    expiring: 0,
    documents: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [
          vendorsResponse,
          contractsResponse,
          expiringResponse,
          documentsResponse
        ] = await Promise.all([
          getVendorCount(),
          getContractCount(),
          getExpiringContractCount(),
          getDocumentCount()
        ]);

        if (vendorsResponse.error) throw new Error(vendorsResponse.error.message);
        if (contractsResponse.error) throw new Error(contractsResponse.error.message);
        if (expiringResponse.error) throw new Error(expiringResponse.error.message);
        if (documentsResponse.error) throw new Error(documentsResponse.error.message);

        setCounts({
          vendors: vendorsResponse.data ?? 0,
          contracts: contractsResponse.data ?? 0,
          expiring: expiringResponse.data ?? 0,
          documents: documentsResponse.data ?? 0
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  // Placeholder data for top-rated vendors
  const topVendors = [
    {
      id: "1",
      name: "Tech Solutions Inc.",
      category: "IT Services",
      status: "active" as const,
      rating: 4.8,
      contracts: 3,
      avatar: "TS"
    },
    {
      id: "2",
      name: "Global Logistics",
      category: "Transportation",
      status: "active" as const,
      rating: 4.7,
      contracts: 5,
      avatar: "GL"
    },
    {
      id: "3",
      name: "Quality Supplies",
      category: "Office Supplies",
      status: "active" as const,
      rating: 4.6,
      contracts: 2,
      avatar: "QS"
    },
    {
      id: "4",
      name: "Secure Systems",
      category: "Cybersecurity",
      status: "pending" as const,
      rating: 4.5,
      contracts: 1,
      avatar: "SS"
    }
  ];

  if (error) {
    return (
      <div className="flex flex-col gap-8 pb-8">
        <PageHeader
          title="Vendor Management Dashboard"
          description="Welcome to VMP Plus. Overview of your vendor management activities."
        />
        <div className="text-red-500 p-4 border border-red-200 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      <PageHeader
        title="Vendor Management Dashboard"
        description="Welcome to VMP Plus. Overview of your vendor management activities."
      />

      <div className="flex flex-col gap-6">
        {/* Summary Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="h-[120px] w-full" />
            </>
          ) : (
            <>
              <SummaryCard 
                title="Total Vendors" 
                value={counts.vendors.toString()} 
                icon={Users}
                trend={{
                  value: "15% from last month",
                  isPositive: true
                }}
              />
              <SummaryCard 
                title="Active Contracts" 
                value={counts.contracts.toString()} 
                icon={FileText}
                trend={{
                  value: "3 new this month",
                  isPositive: true
                }}
              />
              <SummaryCard 
                title="Expiring Soon" 
                value={counts.expiring.toString()} 
                icon={AlertTriangle}
                trend={{
                  value: "2 contracts expiring",
                  isPositive: false
                }}
              />
              <SummaryCard 
                title="Total Documents" 
                value={counts.documents.toString()} 
                icon={Star}
                trend={{
                  value: "4.8 average rating",
                  isPositive: true
                }}
              />
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPlaceholder 
            title="Vendor Growth" 
            description="Trend over the last 6 months"
          />
          <ChartPlaceholder 
            title="Vendor Categories" 
            description="Distribution by industry"
          />
        </div>

        {/* Recent Vendors Section */}
        <RecentVendorsList />

        {/* Top Rated Vendors Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Top Rated Vendors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topVendors.map((vendor) => (
              <TopVendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <RecentActivity />
      </div>
    </div>
  );
} 