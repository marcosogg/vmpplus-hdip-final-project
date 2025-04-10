import { PageHeader } from '@/components/layout/page-header';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';

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
      name: "Salesforce",
      category: "CRM Solutions",
      status: "Active" as const,
      rating: 4.8,
      contractCount: 2,
      logoUrl: "https://logo.clearbit.com/salesforce.com"
    },
    {
      id: "2",
      name: "Microsoft",
      category: "Software & Cloud",
      status: "Active" as const,
      rating: 4.0,
      contractCount: 4,
      logoUrl: "https://logo.clearbit.com/microsoft.com"
    },
    {
      id: "3",
      name: "Adobe Systems",
      category: "Creative Software",
      status: "Pending" as const,
      rating: 5.0,
      contractCount: 1,
      logoUrl: "https://logo.clearbit.com/adobe.com"
    },
    {
      id: "4",
      name: "Oracle",
      category: "Database Solutions",
      status: "Active" as const,
      rating: 4.2,
      contractCount: 3,
      logoUrl: "https://logo.clearbit.com/oracle.com"
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
    <div className="flex flex-col pb-8">
      <PageHeader
        title="Vendor Management Dashboard"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 px-6">
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
              change="+12% from last month"
              changeColor="green"
              icon={Users}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            <SummaryCard 
              title="Active Contracts" 
              value={counts.contracts.toString()}
              change="+5% from last month"
              changeColor="green"
              icon={FileText}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
            />
            <SummaryCard 
              title="Pending Approvals" 
              value={counts.expiring.toString()}
              change="+3 urgent"
              changeColor="red"
              icon={AlertTriangle}
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
              isUrgent={true}
            />
            <SummaryCard 
              title="Avg. Rating" 
              value="4.2"
              change="+0.3 from last quarter"
              changeColor="green"
              icon={Star}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 px-6">
        <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-lg font-medium text-gray-700">Vendor Growth</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-gray-50 rounded border border-dashed">
              Vendor Growth Chart Area
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-lg font-medium text-gray-700">Vendor Categories</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-gray-50 rounded border border-dashed">
              Vendor Categories Chart Area
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6 px-6">
        <div className="xl:col-span-2">
          <RecentVendorsList />
        </div>
        <div className="xl:col-span-1">
          <RecentActivity />
        </div>
      </div>
      
      <div className="mb-6 px-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-700">Top Rated Vendors</h3>
          <Button variant="link" className="p-0 h-auto text-sm font-medium text-primary">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topVendors.map((vendor) => (
            <TopVendorCard
              key={vendor.id}
              logoUrl={vendor.logoUrl}
              name={vendor.name}
              category={vendor.category}
              rating={vendor.rating}
              contractCount={vendor.contractCount}
              status={vendor.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 