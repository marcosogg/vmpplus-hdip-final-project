import { PageHeader } from '@/components/layout/page-header';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Users,
  FileText,
  AlertTriangle,
  Star,
  TrendingUp,
  CheckCircle,
  Filter,
  ChevronDown,
  Briefcase,
  Search
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Vendor, getVendorCount, getActiveVendorCount, getRecentVendors, getVendorCountByCategory, getTopScoredVendors, getVendors } from '@/lib/api/vendors';
import { Contract, getContractCount, getExpiringContractCount, getRecentContracts, getContractCountByStatus, getTotalContractValueByVendor } from '@/lib/api/contracts';
import { getDocumentCount } from '@/lib/api/documents';
import { getRecentActivities, ActivityLog } from '@/lib/api/activity';
import { ApiResponse } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LineChart, DonutChart, PieChart, BarChart } from "@/components/ui/charts";
import { RecentVendorsList } from '@/components/dashboard/recent-vendors-list';
import { TopScoredVendorsList } from '@/components/dashboard/TopScoredVendorsList';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { useDebounce } from '@/hooks/useDebounce';
import { useLocation } from 'react-router-dom';

// Define constants for limits
const ACTIVITY_LIMIT = 4;
const SPEND_CHART_LIMIT = 7;
const TOP_VENDORS_LIMIT = 4;

// Define types for chart data
interface ChartData {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    tension?: number;
    pointBackgroundColor?: string;
    pointBorderColor?: string;
    pointHoverBackgroundColor?: string;
    pointHoverBorderColor?: string;
    borderRadius?: number;
  }[];
}

export function DashboardPage() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Specific state for Vendor Categories Chart
  const [isCategoryChartLoading, setIsCategoryChartLoading] = useState(true);
  const [categoryChartError, setCategoryChartError] = useState<string | null>(null);
  const [vendorCategoryChartData, setVendorCategoryChartData] = useState<ChartData | null>(null);

  // Specific state for Contract Status Chart
  const [isStatusChartLoading, setIsStatusChartLoading] = useState(true);
  const [statusChartError, setStatusChartError] = useState<string | null>(null);
  const [contractStatusChartData, setContractStatusChartData] = useState<ChartData | null>(null);

  // Specific state for Spend by Vendor Chart
  const [isSpendChartLoading, setIsSpendChartLoading] = useState(true);
  const [spendChartError, setSpendChartError] = useState<string | null>(null);
  const [spendByVendorChartData, setSpendByVendorChartData] = useState<ChartData | null>(null);

  // Specific state for Top Scored Vendors List
  const [isTopVendorsLoading, setIsTopVendorsLoading] = useState(true);
  const [topVendorsError, setTopVendorsError] = useState<string | null>(null);
  const [topScoredVendorsData, setTopScoredVendorsData] = useState<Vendor[] | null>(null);

  // State for Vendor Search - modified to get from URL
  const searchParams = new URLSearchParams(location.search);
  const initialSearchTerm = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [searchResults, setSearchResults] = useState<Vendor[] | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [counts, setCounts] = useState({
    vendors: 0,
    contracts: 0,
    expiring: 0,
    documents: 0,
    activeVendors: 0
  });
  const [recentVendorsData, setRecentVendorsData] = useState<Vendor[] | null>(null);
  const [activityFeedData, setActivityFeedData] = useState<ActivityLog[] | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      setActivityFeedData(null);
      setRecentVendorsData(null);
      setIsCategoryChartLoading(true);
      setCategoryChartError(null);
      setVendorCategoryChartData(null);
      setIsStatusChartLoading(true);
      setStatusChartError(null);
      setContractStatusChartData(null);
      // Reset specific chart states
      setIsSpendChartLoading(true);
      setSpendChartError(null);
      setSpendByVendorChartData(null);
      // Reset specific list states
      setIsTopVendorsLoading(true);
      setTopVendorsError(null);
      setTopScoredVendorsData(null);

      try {
        const results = await Promise.allSettled([
          getVendorCount(),
          getContractCount(),
          getExpiringContractCount(),
          getDocumentCount(),
          getActiveVendorCount(),
          getRecentVendors(ACTIVITY_LIMIT),
          getRecentActivities(ACTIVITY_LIMIT),
          getVendorCountByCategory(),
          getContractCountByStatus(),
          getTotalContractValueByVendor(SPEND_CHART_LIMIT),
          getTopScoredVendors(TOP_VENDORS_LIMIT)
        ]);

        const errors: string[] = [];
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(`API call ${index} failed:`, result.reason);
            const message = result.reason instanceof Error ? result.reason.message : 'Unknown API error';
            const nestedMessage = (result.reason as any)?.error?.message;
            errors.push(nestedMessage || message);
          }
        });

        if (errors.length > 0) {
          throw new Error(`Failed to load some dashboard data: ${errors.slice(0, 2).join('; ')}`);
        }

        const [ 
          vendorsResponse,
          contractsResponse,
          expiringResponse,
          documentsResponse,
          activeVendorsResponse,
          recentVendorsResponse,
          activitiesResponse,
          categoryCountResponse,
          statusCountResponse,
          spendByVendorResponse,
          topVendorsResponse
        ] = results.map(r => (r.status === 'fulfilled' ? r.value : { data: null, error: 'Failed' }));

        setCounts({
          vendors: (vendorsResponse as ApiResponse<number>).data ?? 0,
          contracts: (contractsResponse as ApiResponse<number>).data ?? 0,
          expiring: (expiringResponse as ApiResponse<number>).data ?? 0,
          documents: (documentsResponse as ApiResponse<number>).data ?? 0,
          activeVendors: (activeVendorsResponse as ApiResponse<number>).data ?? 0
        });

        const recentVendors = (recentVendorsResponse as ApiResponse<Vendor[]>).data ?? [];
        setRecentVendorsData(recentVendors);

        const activities = (activitiesResponse as ApiResponse<ActivityLog[]>).data ?? [];
        setActivityFeedData(activities);

        setIsCategoryChartLoading(false);
        const categoryResultError = categoryCountResponse.error;
        if (categoryResultError) {
           const errorMessage = (typeof categoryResultError === 'object' && categoryResultError !== null && 'message' in categoryResultError) 
             ? categoryResultError.message 
             : (typeof categoryResultError === 'string' ? categoryResultError : 'Failed to load category data');
           setCategoryChartError(errorMessage);
        } else {
          const categoryData = (categoryCountResponse as ApiResponse<{ category: string; count: number }[]>).data ?? [];
          if (categoryData.length > 0) {
            const labels = categoryData.map(item => item.category);
            const data = categoryData.map(item => item.count);
            const backgroundColors = [
                "rgba(99, 102, 241, 0.8)",
                "rgba(59, 130, 246, 0.8)",
                "rgba(16, 185, 129, 0.8)",
                "rgba(245, 158, 11, 0.8)",
                "rgba(239, 68, 68, 0.8)",
                "rgba(107, 114, 128, 0.8)",
            ];
            setVendorCategoryChartData({
              labels,
              datasets: [
                {
                  label: "Vendors by Category",
                  data,
                  backgroundColor: backgroundColors.slice(0, data.length),
                  borderColor: '#fff',
                  borderWidth: 2,
                },
              ],
            });
          } else {
            setVendorCategoryChartData({ labels: ['No Categories Found'], datasets: [{ data: [1], backgroundColor: ["rgba(107, 114, 128, 0.8)"] }] });
          }
        }

        setIsStatusChartLoading(false);
        const statusResultError = statusCountResponse.error;
        if (statusResultError) {
          const errorMessage = (typeof statusResultError === 'object' && statusResultError !== null && 'message' in statusResultError) 
            ? statusResultError.message 
            : (typeof statusResultError === 'string' ? statusResultError : 'Failed to load status data');
          setStatusChartError(errorMessage);
        } else {
          const statusData = (statusCountResponse as ApiResponse<{ status: string; count: number }[]>).data ?? [];
          // Define colors based on potential statuses (adjust as needed)
          const statusColors: { [key: string]: string } = {
            Active: "rgba(16, 185, 129, 0.8)",    // green
            Pending: "rgba(245, 158, 11, 0.8)",   // amber
            Expired: "rgba(107, 114, 128, 0.8)",  // gray
            Terminated: "rgba(239, 68, 68, 0.8)",  // red
            Draft: "rgba(59, 130, 246, 0.8)",     // blue
            Unknown: "rgba(156, 163, 175, 0.8)"    // light gray
          };

          if (statusData.length > 0) {
            const labels = statusData.map(item => item.status.charAt(0).toUpperCase() + item.status.slice(1)); // Capitalize status
            const data = statusData.map(item => item.count);
            // Define colors based on potential statuses (adjust as needed)
            const backgroundColors = labels.map(label => statusColors[label] || statusColors.Unknown);

            setContractStatusChartData({
              labels,
              datasets: [
                {
                  label: "Contract Status",
                  data,
                  backgroundColor: backgroundColors,
                  borderColor: '#fff',
                  borderWidth: 2,
                },
              ],
            });
          } else {
            setContractStatusChartData({ labels: ['No Contracts Found'], datasets: [{ data: [1], backgroundColor: [statusColors.Unknown] }] });
          }
        }

        // --- Process Spend by Vendor Chart Data ---
        setIsSpendChartLoading(false); // Set loading false after the call is settled
        const spendResultError = spendByVendorResponse.error;
        if (spendResultError) {
          const errorMessage = (typeof spendResultError === 'object' && spendResultError !== null && 'message' in spendResultError) 
            ? spendResultError.message 
            : (typeof spendResultError === 'string' ? spendResultError : 'Failed to load spend data');
          // Check for specific RPC error message
           if (errorMessage.includes('RPC function get_total_contract_value_by_vendor not found')) {
             setSpendChartError('Setup Error: SQL function missing. Please run the required SQL.');
           } else {
             setSpendChartError(errorMessage);
           }
        } else {
          const spendData = (spendByVendorResponse as ApiResponse<{ name: string; total_value: number }[]>).data ?? [];
          if (spendData.length > 0) {
            const labels = spendData.map(item => item.name);
            const data = spendData.map(item => item.total_value);
            // Consistent colors for bar chart
            const backgroundColors = [
                "rgba(99, 102, 241, 0.8)",
                "rgba(59, 130, 246, 0.8)",
                "rgba(16, 185, 129, 0.8)",
                "rgba(245, 158, 11, 0.8)",
                "rgba(239, 68, 68, 0.8)",
                "rgba(107, 114, 128, 0.8)",
                "rgba(156, 163, 175, 0.8)" // Add more if SPEND_CHART_LIMIT increases
              ];

            setSpendByVendorChartData({
              labels,
              datasets: [
                {
                  label: "Total Contract Value", // Simplified label
                  data,
                  backgroundColor: backgroundColors.slice(0, data.length),
                  borderRadius: 4,
                },
              ],
            });
          } else {
            setSpendByVendorChartData({ labels: ['No Spend Data Available'], datasets: [{ data: [0], backgroundColor: ["rgba(107, 114, 128, 0.8)"] }] });
          }
        }
        // ----------------------------------------

        // --- Process Top Scored Vendors List Data ---
        setIsTopVendorsLoading(false); // Set loading false after the call is settled
        const topVendorsResultError = topVendorsResponse.error;
        if (topVendorsResultError) {
          const errorMessage = (typeof topVendorsResultError === 'object' && topVendorsResultError !== null && 'message' in topVendorsResultError) 
            ? topVendorsResultError.message 
            : (typeof topVendorsResultError === 'string' ? topVendorsResultError : 'Failed to load top vendors');
           setTopVendorsError(errorMessage);
        } else {
           const topVendorsData = (topVendorsResponse as ApiResponse<Vendor[]>).data ?? [];
           setTopScoredVendorsData(topVendorsData);
        }
        // ----------------------------------------

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        console.error("Dashboard fetch error:", err);
        setError(errorMessage);
        setCounts({ vendors: 0, contracts: 0, expiring: 0, documents: 0, activeVendors: 0 });
        setRecentVendorsData(null);
        setActivityFeedData(null);
        setCategoryChartError(errorMessage);
        setVendorCategoryChartData(null);
        setStatusChartError(errorMessage);
        setContractStatusChartData(null);
        setSpendChartError(errorMessage);
        setSpendByVendorChartData(null);
        setTopVendorsError(errorMessage);
        setTopScoredVendorsData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // useEffect for checking search term from URL params
  useEffect(() => {
    const urlSearchTerm = searchParams.get('search') || '';
    if (urlSearchTerm !== searchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [location.search]);

  // useEffect for fetching search results when debouncedSearchTerm changes
  useEffect(() => {
    console.log(`[Dashboard] Debounced search term changed: "${debouncedSearchTerm}"`);
    
    const fetchSearchResults = async () => {
      // Clear previous results if search term is empty
      if (!debouncedSearchTerm || !debouncedSearchTerm.trim()) {
        console.log('[Dashboard] Search term empty, clearing results');
        setSearchResults(null);
        setIsSearchLoading(false);
        setSearchError(null);
        return;
      }

      console.log(`[Dashboard] Fetching search results for: "${debouncedSearchTerm}"`);
      setIsSearchLoading(true);
      setSearchError(null);

      try {
        // Call the modified getVendors function with the debounced term
        const response = await getVendors(debouncedSearchTerm);
        console.log('[Dashboard] Search API response:', response);
        
        if (response.error) {
          console.error('[Dashboard] Search API error:', response.error);
          throw response.error;
        }
        
        console.log(`[Dashboard] Search returned ${response.data?.length || 0} results`);
        setSearchResults(response.data ?? []);
      } catch (err) {
        console.error("[Dashboard] Search fetch error:", err);
        const message = err instanceof Error ? err.message : 'Failed to search vendors';
        setSearchError(message);
        setSearchResults([]); // Set empty array on error to indicate no results found
      } finally {
        setIsSearchLoading(false);
      }
    };

    fetchSearchResults();
    // Dependency array includes the debounced search term
  }, [debouncedSearchTerm]);

  // Mock Vendor Growth Data (replace later if needed)
  const vendorGrowthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Vendors",
        data: [3, 2, 5, 4, 6, 7],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.3,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(99, 102, 241)",
      },
    ],
  };

  if (error) {
    return (
      <div className="flex flex-col gap-8 p-6">
        <div className="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-[110px] w-full" />
            <Skeleton className="h-[110px] w-full" />
            <Skeleton className="h-[110px] w-full" />
            <Skeleton className="h-[110px] w-full" />
          </>
        ) : (
          <>
            <SummaryCard 
              title="Total Vendors" 
              value={counts.vendors.toString()}
              change="+12% from last month"
              icon={Users}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            <SummaryCard 
              title="Active Contracts" 
              value={counts.contracts.toString()}
              change="+5% from last month"
              icon={FileText}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
            />
            <SummaryCard 
              title="Total Documents" 
              value={counts.documents.toString()}
              change="+8% from last month"
              icon={FileText}
              iconBgColor="bg-cyan-100"
              iconColor="text-cyan-600"
            />
            <SummaryCard 
              title="Active Vendors" 
              value={counts.activeVendors.toString()}
              change="Updated"
              icon={Briefcase}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
            />
            <SummaryCard 
              title="Pending Approvals" 
              value={counts.expiring.toString()}
              change="+3 urgent"
              icon={AlertTriangle}
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
              isUrgent={counts.expiring > 0}
            />
          </>
        )}
      </div>

      {/* Conditional Rendering: Search Results or Default Dashboard View */}
      {searchTerm ? (
          <div className="pt-4">
            <h2 className="text-xl font-semibold mb-4">
              Search Results for "{searchTerm}"
              {!isSearchLoading && searchResults && <span className="text-sm text-gray-500 ml-2">
                ({searchResults.length} {searchResults.length === 1 ? 'result' : 'results'})
              </span>}
            </h2>
            
            {isSearchLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full rounded" />
                ))}
              </div>
            ) : searchError ? (
              <div className="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>Error searching vendors: {searchError}</span>
              </div>
            ) : searchResults && searchResults.length === 0 ? (
              <div className="text-gray-500 p-6 border border-gray-200 rounded-lg bg-gray-50 text-center">
                <p>No vendors found matching "{searchTerm}"</p>
                <p className="text-sm mt-1">Try a different search term or check spelling</p>
              </div>
            ) : (
              <RecentVendorsList
                vendors={searchResults}
                isLoading={isSearchLoading}
                error={searchError}
              />
            )}
          </div>
        ) : (
          // Render Default Dashboard Sections
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-lg font-medium">Vendor Growth</CardTitle>
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <Button variant="outline" size="sm" className="gap-1">
                         <span>Last 6 Months</span>
                         <ChevronDown className="h-4 w-4" />
                       </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                       <DropdownMenuItem>Last 3 Months</DropdownMenuItem>
                       <DropdownMenuItem>Last 6 Months</DropdownMenuItem>
                       <DropdownMenuItem>Last Year</DropdownMenuItem>
                       <DropdownMenuItem>All Time</DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 </CardHeader>
                <CardContent>
                   <div className="h-[300px]">
                     <LineChart
                       data={vendorGrowthData}
                       options={{
                         plugins: { legend: { display: true, position: 'top' as const } },
                         scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
                       }}
                     />
                   </div>
                 </CardContent>
              </Card>

              <Card>
                 <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-lg font-medium">Vendor Categories</CardTitle>
                   <Button variant="outline" size="sm" className="gap-1">
                     <Filter className="h-4 w-4" />
                     <span>Filter</span>
                   </Button>
                 </CardHeader>
                 <CardContent>
                   <div className="h-[300px] flex items-center justify-center">
                     {isCategoryChartLoading ? (
                       <Skeleton className="h-[280px] w-[280px] rounded-full" />
                     ) : categoryChartError ? (
                       <div className="text-red-500 text-center px-4">
                         <AlertTriangle className="inline-block h-5 w-5 mr-1" /> 
                         Error: {categoryChartError}
                       </div>
                     ) : vendorCategoryChartData ? (
                       <DonutChart
                         data={vendorCategoryChartData}
                         options={{
                           plugins: { legend: { position: 'right' as const } },
                           maintainAspectRatio: false,
                         }}
                       />
                     ) : (
                       <div className="text-gray-500">No data available</div>
                     )}
                   </div>
                 </CardContent>
               </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <Card>
                 <CardHeader>
                   <CardTitle className="text-lg font-medium">Contract Status</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="h-[250px] flex items-center justify-center">
                      {isStatusChartLoading ? (
                       <Skeleton className="h-[230px] w-[230px] rounded-full" />
                     ) : statusChartError ? (
                       <div className="text-red-500 text-center px-4">
                         <AlertTriangle className="inline-block h-5 w-5 mr-1" /> 
                         Error: {statusChartError}
                       </div>
                     ) : contractStatusChartData ? (
                       <PieChart
                         data={contractStatusChartData}
                         options={{
                           plugins: { legend: { position: 'right' as const } },
                           maintainAspectRatio: false,
                         }}
                       />
                      ) : (
                       <div className="text-gray-500">No data available</div>
                     )}
                   </div>
                 </CardContent>
               </Card>

               <Card>
                 <CardHeader>
                   <CardTitle className="text-lg font-medium">Spend by Vendor</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="h-[250px] flex items-center justify-center">
                     {isSpendChartLoading ? (
                       <Skeleton className="h-[230px] w-full" /> // Bar chart skeleton
                     ) : spendChartError ? (
                       <div className="text-red-500 text-center px-4">
                         <AlertTriangle className="inline-block h-5 w-5 mr-1" /> 
                         Error: {spendChartError}
                       </div>
                     ) : spendByVendorChartData ? (
                       <BarChart
                         data={spendByVendorChartData} // Use state data
                         options={{
                           indexAxis: 'y' as const, // Keep horizontal bars
                           plugins: { legend: { display: false } }, // Hide legend if label is clear
                           scales: { x: { beginAtZero: true } },
                           maintainAspectRatio: false,
                         }}
                       />
                     ) : (
                       <div className="text-gray-500">No data available</div>
                     )}
                   </div>
                 </CardContent>
               </Card>
             </div>

             {/* Recent Vendors & Recent Activities */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <RecentVendorsList 
                 vendors={recentVendorsData}
                 isLoading={isLoading}
                 error={error}
                 limit={ACTIVITY_LIMIT}
               />

               <RecentActivity
                 activities={activityFeedData}
                 isLoading={isLoading}
                 error={error}
               />
             </div>

             {/* Top Scored Vendors */}
             <div className="grid grid-cols-1 gap-6">
               <TopScoredVendorsList 
                 vendors={topScoredVendorsData}
                 isLoading={isTopVendorsLoading}
                 error={topVendorsError}
                 limit={TOP_VENDORS_LIMIT}
               />
             </div>
          </>
      )}
    </div>
  );
} 