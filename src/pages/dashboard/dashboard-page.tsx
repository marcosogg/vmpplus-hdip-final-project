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
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getVendorCount, getActiveVendorCount, getAverageVendorRating, getTopRatedVendors, getRecentVendors } from '@/lib/api/vendors';
import { getContractCount, getUrgentContractCount } from '@/lib/api/contracts';
import { getDocumentCount } from '@/lib/api/documents';
import { getRecentActivities, Activity } from '@/lib/api/activities';
import { 
  getVendorCategoryDistribution,
  getContractStatusDistribution,
  getSpendByVendor,
  CategoryChartData,
  SpendChartData,
  getRecentVendorScores
} from '@/lib/api/analytics';
import { ApiResponse } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LineChart, DonutChart, PieChart, BarChart } from "@/components/ui/charts";

// Default empty chart data structures
const defaultCategoryChartData: CategoryChartData = {
  labels: [],
  datasets: [{
    label: '',
    data: [],
    backgroundColor: [],
  }],
};

const defaultSpendChartData: SpendChartData = {
  labels: [],
  datasets: [{
    label: '',
    data: [],
    backgroundColor: [],
  }],
};

export function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    vendors: 0,
    activeVendors: 0,
    contracts: 0,
    urgent: 0,
    documents: 0,
    averageRating: 0
  });
  const [topRatedVendors, setTopRatedVendors] = useState<any[]>([]);
  const [isLoadingTopVendors, setIsLoadingTopVendors] = useState(true);
  const [recentVendors, setRecentVendors] = useState<any[]>([]);
  const [isLoadingRecentVendors, setIsLoadingRecentVendors] = useState(true);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [isLoadingRecentActivities, setIsLoadingRecentActivities] = useState(true);
  const [vendorGrowthTimeRange, setVendorGrowthTimeRange] = useState<'3m' | '6m' | '1y' | 'all'>('6m');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  
  const [vendorCategoriesData, setVendorCategoriesData] = useState<CategoryChartData>(defaultCategoryChartData);
  const [isLoadingVendorCategories, setIsLoadingVendorCategories] = useState(true);

  const [contractStatusData, setContractStatusData] = useState<CategoryChartData>(defaultCategoryChartData);
  const [isLoadingContractStatus, setIsLoadingContractStatus] = useState(true);

  const [spendByVendorData, setSpendByVendorData] = useState<SpendChartData>(defaultSpendChartData);
  const [isLoadingSpendByVendor, setIsLoadingSpendByVendor] = useState(true);

  // Rename state for the score trend chart
  const [newVendorScoreData, setNewVendorScoreData] = useState<CategoryChartData>(defaultCategoryChartData);
  const [isLoadingNewVendorScore, setIsLoadingNewVendorScore] = useState(true);

  // Rename state for the recent scores chart
  const [recentVendorScoreData, setRecentVendorScoreData] = useState<CategoryChartData>(defaultCategoryChartData);
  const [isLoadingRecentVendorScores, setIsLoadingRecentVendorScores] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [
          vendorsResponse,
          activeVendorsResponse,
          contractsResponse,
          urgentResponse,
          documentsResponse,
          ratingResponse
        ] = await Promise.all([
          getVendorCount(),
          getActiveVendorCount(),
          getContractCount(),
          getUrgentContractCount(),
          getDocumentCount(),
          getAverageVendorRating()
        ]);

        if (vendorsResponse.error) throw new Error(vendorsResponse.error.message);
        if (activeVendorsResponse.error) throw new Error(activeVendorsResponse.error.message);
        if (contractsResponse.error) throw new Error(contractsResponse.error.message);
        if (urgentResponse.error) throw new Error(urgentResponse.error.message);
        if (documentsResponse.error) throw new Error(documentsResponse.error.message);
        if (ratingResponse.error) throw new Error(ratingResponse.error.message);

        setCounts({
          vendors: vendorsResponse.data ?? 0,
          activeVendors: activeVendorsResponse.data ?? 0,
          contracts: contractsResponse.data ?? 0,
          urgent: urgentResponse.data ?? 0,
          documents: documentsResponse.data ?? 0,
          averageRating: ratingResponse.data ?? 0
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  // Fetch top rated vendors
  useEffect(() => {
    const fetchTopRatedVendors = async () => {
      try {
        setIsLoadingTopVendors(true);
        const response = await getTopRatedVendors(4);
        
        if (response.error) throw new Error(response.error.message);
        
        // Add contract count and ensure consistent property names
        const vendorsWithFormattedData = response.data?.map(vendor => ({
          ...vendor,
          // Ensure we have a logo property (using logo_url from vendor or a fallback)
          logo: vendor.logo_url || `https://logo.clearbit.com/${vendor.name.toLowerCase().replace(/\s+/g, '')}.com`,
          // If contracts data isn't available, use a default value
          contracts: 0, // Default to 0 contracts since we don't have contracts_count
          // Normalize status field
          status: vendor.status?.toLowerCase() || 'pending'
        })) || [];
        
        setTopRatedVendors(vendorsWithFormattedData);
      } catch (err) {
        console.error('Error fetching top rated vendors:', err);
        // Fallback to mock data if there's an error
        setTopRatedVendors([
          {
            id: "sfdc", name: "Salesforce", category: "CRM Solutions",
            logo: "https://logo.clearbit.com/salesforce.com", rating: 4.8, status: "active", contracts: 2,
          },
          {
            id: "msft2", name: "Microsoft", category: "Software & Cloud",
            logo: "https://logo.clearbit.com/microsoft.com", rating: 4.0, status: "active", contracts: 4,
          },
          {
            id: "adobe", name: "Adobe Systems", category: "Creative Software",
            logo: "https://logo.clearbit.com/adobe.com", rating: 5.0, status: "pending", contracts: 1,
          },
          {
            id: "oracle", name: "Oracle", category: "Database Solutions",
            logo: "https://logo.clearbit.com/oracle.com", rating: 4.2, status: "active", contracts: 3,
          },
        ]);
      } finally {
        setIsLoadingTopVendors(false);
      }
    };

    fetchTopRatedVendors();
  }, []);

  // Fetch recent vendors
  useEffect(() => {
    const fetchRecentVendors = async () => {
      try {
        setIsLoadingRecentVendors(true);
        const response = await getRecentVendors(4);
        
        if (response.error) throw new Error(response.error.message);
        
        // Add contract count and ensure consistent property names
        const vendorsWithFormattedData = response.data?.map(vendor => ({
          ...vendor,
          // Ensure we have a logo property (using logo_url from vendor or a fallback)
          logo: vendor.logo_url || `https://logo.clearbit.com/${vendor.name.toLowerCase().replace(/\s+/g, '')}.com`,
          // If contracts data isn't available, use a default value
          contracts: 0, // Default to 0 contracts since we don't have contracts_count
          // Normalize status field
          status: vendor.status?.toLowerCase() || 'pending'
        })) || [];
        
        setRecentVendors(vendorsWithFormattedData);
      } catch (err) {
        console.error('Error fetching recent vendors:', err);
        // Fallback to mock data if there's an error
        setRecentVendors([
          {
            id: "aws", name: "Amazon Web Services", category: "Cloud Services",
            logo: "https://logo.clearbit.com/amazon.com", status: "active", contracts: 3,
          },
          {
            id: "fedex", name: "FedEx Logistics", category: "Shipping",
            logo: "https://logo.clearbit.com/fedex.com", status: "active", contracts: 2,
          },
          {
            id: "ibm", name: "IBM Solutions", category: "IT Services",
            logo: "https://logo.clearbit.com/ibm.com", status: "pending", contracts: 1,
          },
          {
            id: "msft", name: "Microsoft", category: "Software & Cloud",
            logo: "https://logo.clearbit.com/microsoft.com", status: "active", contracts: 4,
          },
        ]);
      } finally {
        setIsLoadingRecentVendors(false);
      }
    };

    fetchRecentVendors();
  }, []);

  // Fetch recent activities
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setIsLoadingRecentActivities(true);
        const response = await getRecentActivities(4);
        
        if (response.error) throw new Error(response.error.message);
        
        setRecentActivities(response.data || []);
      } catch (err) {
        console.error('Error fetching recent activities:', err);
        // Error state is handled via fallback data in the API
      } finally {
        setIsLoadingRecentActivities(false);
      }
    };

    fetchRecentActivities();
  }, []);

  // Fetch vendor category distribution data based on filter
  useEffect(() => {
    const fetchVendorCategories = async () => {
      setIsLoadingVendorCategories(true);
      try {
        const response = await getVendorCategoryDistribution(categoryFilter);
        if (response.error) throw new Error(response.error.message);
        setVendorCategoriesData(response.data || defaultCategoryChartData);
      } catch (err) {
        console.error("Error fetching vendor category data:", err);
        setVendorCategoriesData(defaultCategoryChartData); // Set to default on error
      } finally {
        setIsLoadingVendorCategories(false);
      }
    };

    fetchVendorCategories();
  }, [categoryFilter]); // Re-run when category filter changes

  // Fetch contract status distribution data
  useEffect(() => {
    const fetchContractStatus = async () => {
      setIsLoadingContractStatus(true);
      try {
        const response = await getContractStatusDistribution();
        if (response.error) throw new Error(response.error.message);
        setContractStatusData(response.data as CategoryChartData || defaultCategoryChartData);
      } catch (err) {
        console.error("Error fetching contract status data:", err);
        setContractStatusData(defaultCategoryChartData); // Set to default on error
      } finally {
        setIsLoadingContractStatus(false);
      }
    };

    fetchContractStatus();
  }, []); // Run only once on mount

  // Fetch spend by vendor data
  useEffect(() => {
    const fetchSpendByVendor = async () => {
      setIsLoadingSpendByVendor(true);
      try {
        const response = await getSpendByVendor(); // Using default limit
        if (response.error) throw new Error(response.error.message);
        setSpendByVendorData(response.data as SpendChartData || defaultSpendChartData);
      } catch (err) {
        console.error("Error fetching spend by vendor data:", err);
        setSpendByVendorData(defaultSpendChartData); // Set to default on error
      } finally {
        setIsLoadingSpendByVendor(false);
      }
    };

    fetchSpendByVendor();
  }, []); // Run only once on mount

  // Fetch recent vendor score data (no dependency on timeRange)
  useEffect(() => {
    const fetchRecentScores = async () => {
      setIsLoadingRecentVendorScores(true);
      try {
        // Call the new simplified function
        const response = await getRecentVendorScores(); // No timeRange needed
        if (response.error) throw new Error(response.error.message);
        
        // Set the renamed state with modified backgroundColor
        if (response.data) {
          // Fix the type issue with backgroundColor
          const modifiedData = {
            ...response.data,
            datasets: response.data.datasets.map(dataset => ({
              ...dataset,
              backgroundColor: ['rgba(99, 102, 241, 0.8)'] // Array of one color to match the expected type
            }))
          };
          setRecentVendorScoreData(modifiedData as CategoryChartData);
        } else {
          setRecentVendorScoreData(defaultCategoryChartData);
        }
      } catch (err) {
        console.error("Error fetching recent vendor score data:", err);
        setRecentVendorScoreData(defaultCategoryChartData); // Set to default on error
      } finally {
        setIsLoadingRecentVendorScores(false);
      }
    };

    fetchRecentScores();
  }, []); // Run only once on mount

  // Function to handle time range selection
  const handleTimeRangeChange = (value: '3m' | '6m' | '1y' | 'all') => {
    setVendorGrowthTimeRange(value);
    console.log("Time range changed to:", value, "(but does not affect Recent Scores chart)");
  };

  // Sample categories to filter by
  const availableCategories = ["IT Services", "Logistics", "Software", "Hardware", "Consulting", "Other"];
  
  // Function to handle category filter selection
  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    setIsCategoryFilterOpen(false);
    // No need to log, useEffect will trigger refetch
  };
  
  // Function to clear the category filter
  const clearCategoryFilter = () => {
    setCategoryFilter(null);
    // No need to log, useEffect will trigger refetch
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
              title="Urgent Contracts" 
              value={counts.urgent.toString()}
              change={`${counts.urgent} urgent`}
              icon={AlertTriangle}
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
              isUrgent={true}
            />
            <SummaryCard 
              title="Avg. Rating" 
              value={counts.averageRating.toString()}
              change="+0.3 from last quarter"
              icon={Star}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-lg font-medium">Vendor Scores</CardTitle>
           </CardHeader>
          <CardContent>
             <div className="h-[300px]">
               {isLoadingRecentVendorScores ? (
                 <div className="flex items-center justify-center h-full">
                   <Skeleton className="h-full w-full" />
                 </div>
               ) : (
                 <BarChart
                   data={recentVendorScoreData}
                   options={{
                     plugins: { legend: { display: false } },
                     scales: { 
                       y: { 
                         min: 1, 
                         max: 5, 
                         beginAtZero: false, 
                         ticks: { precision: 1 } 
                       } 
                     },
                   }}
                 />
               )}
             </div>
           </CardContent>
        </Card>

        <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-lg font-medium">Vendor Categories</CardTitle>
             <div className="flex items-center gap-2">
               {categoryFilter && (
                 <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 cursor-pointer" onClick={clearCategoryFilter}>
                   {categoryFilter} <X className="ml-1 h-3 w-3" />
                 </Badge>
               )}
               <Dialog open={isCategoryFilterOpen} onOpenChange={setIsCategoryFilterOpen}>
                 <DialogTrigger asChild>
                   {/* <Button variant="outline" size="sm" className="gap-1">
                     <Filter className="h-4 w-4" />
                     <span>Filter</span>
                   </Button> */}
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-[425px]">
                   <DialogHeader>
                     <DialogTitle>Filter Vendor Categories</DialogTitle>
                     <DialogDescription>
                       Select a category to filter the chart data.
                     </DialogDescription>
                   </DialogHeader>
                   <div className="grid gap-2 py-4">
                     {availableCategories.map((category) => (
                       <Button 
                         key={category} 
                         variant={categoryFilter === category ? "default" : "outline"}
                         className="justify-start"
                         onClick={() => handleCategoryFilter(category)}
                       >
                         {category}
                       </Button>
                     ))}
                   </div>
                   <DialogFooter>
                     <Button variant="outline" onClick={clearCategoryFilter}>Clear Filter</Button>
                     <DialogClose asChild>
                       <Button variant="ghost">Close</Button>
                     </DialogClose>
                   </DialogFooter>
                 </DialogContent>
               </Dialog>
             </div>
           </CardHeader>
           <CardContent>
             <div className="h-[300px]">
               {isLoadingVendorCategories ? (
                 <div className="flex items-center justify-center h-full">
                   <Skeleton className="h-full w-full" />
                 </div>
               ) : vendorCategoriesData.labels.length > 0 ? (
                 <DonutChart
                   data={vendorCategoriesData}
                   options={{
                     plugins: { legend: { position: 'right' as const } },
                   }}
                 />
               ) : (
                 <div className="flex items-center justify-center h-full text-gray-500">
                   No data for selected category.
                 </div>
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
             <div className="h-[250px]">
              {isLoadingContractStatus ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <PieChart
                  data={contractStatusData}
                  options={{
                    plugins: { legend: { position: 'right' as const } },
                  }}
                />
              )}
             </div>
           </CardContent>
         </Card>

         <Card>
           <CardHeader>
             <CardTitle className="text-lg font-medium">Spend by Vendor</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="h-[250px]">
              {isLoadingSpendByVendor ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <BarChart
                  data={spendByVendorData}
                  options={{
                    indexAxis: 'y' as const,
                    plugins: { legend: { display: true, position: 'top' as const } },
                    scales: { x: { beginAtZero: true } },
                  }}
                />
              )}
             </div>
           </CardContent>
         </Card>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-lg font-medium">Recent Vendors</CardTitle>
             <Link to="/app/vendors">
               <Button variant="link" size="sm" className="text-indigo-600 h-auto p-0">
                 View All
               </Button>
             </Link>
           </CardHeader>
           <CardContent className="space-y-4">
             {isLoadingRecentVendors ? (
               // Loading skeletons
               <>
                 <Skeleton className="h-[60px] w-full rounded-lg" />
                 <Skeleton className="h-[60px] w-full rounded-lg" />
                 <Skeleton className="h-[60px] w-full rounded-lg" />
                 <Skeleton className="h-[60px] w-full rounded-lg" />
               </>
             ) : recentVendors.length > 0 ? (
               recentVendors.map((vendor) => (
                 <div
                   key={vendor.id}
                   className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                 >
                   <div className="flex items-center gap-3">
                     <Avatar className="h-10 w-10">
                       <AvatarImage src={vendor.logo} alt={vendor.name} />
                       <AvatarFallback>{vendor.name.substring(0, 2)}</AvatarFallback>
                     </Avatar>
                     <div>
                       <p className="font-medium text-sm">{vendor.name}</p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">{vendor.category}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <Badge
                       variant={ vendor.status === "active" ? "outline" : "outline" }
                       className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                         vendor.status === "active" 
                           ? "bg-green-100 text-green-700 border border-green-200" 
                           : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                       }`}
                     >
                       {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                     </Badge>
                     <Link to={`/app/vendors/${vendor.id}`}>
                       <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                         View Details
                       </Button>
                     </Link>
                   </div>
                 </div>
               ))
             ) : (
               <div className="text-center py-4 text-gray-500">
                 No vendors found
               </div>
             )}
           </CardContent>
         </Card>

         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-lg font-medium">Recent Activities</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             {isLoadingRecentActivities ? (
               // Loading skeletons
               <>
                 <Skeleton className="h-[60px] w-full rounded-lg" />
                 <Skeleton className="h-[60px] w-full rounded-lg" />
                 <Skeleton className="h-[60px] w-full rounded-lg" />
                 <Skeleton className="h-[60px] w-full rounded-lg" />
               </>
             ) : recentActivities.length > 0 ? (
               recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className={`mt-0.5 ${activity.iconColor}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 text-sm">
                          <p className="font-medium">
                            {activity.type === "contract_signed" && "New contract signed with "}
                            {activity.type === "document_submitted" && "Vendor "}
                            {activity.type === "contract_expiring" && "Contract with "}
                            {activity.type === "rating_received" && ""}
                            <span className="font-semibold">{activity.vendor}</span>
                            {activity.type === "document_submitted" && " submitted documents for review"}
                            {activity.type === "contract_expiring" && ` ${activity.details}`}
                            {activity.type === "rating_received" && ` ${activity.details}`}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                  );
               })
             ) : (
               <div className="text-center py-4 text-gray-500">
                 No recent activities
               </div>
             )}
           </CardContent>
         </Card>
       </div>

       <Card>
         <CardHeader className="flex flex-row items-center justify-between pb-2">
           <CardTitle className="text-lg font-medium">Top Rated Vendors</CardTitle>
           <Link to="/app/vendors">
             <Button variant="link" size="sm" className="text-indigo-600 h-auto p-0">
               View All
             </Button>
           </Link>
         </CardHeader>
         <CardContent>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {isLoadingTopVendors ? (
               // Loading skeletons
               <>
                 <Skeleton className="h-[200px] w-full rounded-lg" />
                 <Skeleton className="h-[200px] w-full rounded-lg" />
                 <Skeleton className="h-[200px] w-full rounded-lg" />
                 <Skeleton className="h-[200px] w-full rounded-lg" />
               </>
             ) : (
               topRatedVendors.map((vendor) => (
                 <div key={vendor.id} className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                     <Avatar className="h-12 w-12">
                       <AvatarImage src={vendor.logo} alt={vendor.name} />
                       <AvatarFallback>{vendor.name.substring(0, 2)}</AvatarFallback>
                     </Avatar>
                     <Badge
                       variant={ vendor.status === "active" ? "outline" : "outline" }
                       className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                         vendor.status === "active" 
                           ? "bg-green-100 text-green-700 border border-green-200" 
                           : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                       }`}
                     >
                       {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                     </Badge>
                   </div>
                   <h3 className="font-semibold text-base mb-1">{vendor.name}</h3>
                   <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{vendor.category}</p>
                   <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center">
                       <div className="flex">
                         {[...Array(5)].map((_, i) => (
                           <Star
                             key={i}
                             className={`h-4 w-4 ${
                               i < Math.floor(vendor.rating) ? "text-yellow-400 fill-yellow-400"
                               : i < vendor.rating ? "text-yellow-400 fill-yellow-400"
                               : "text-gray-300"
                             }`}
                           />
                         ))}
                       </div>
                       <span className="ml-2 text-xs font-medium">{vendor.rating?.toFixed(1) || "0.0"}</span>
                     </div>
                     <Link to={`/app/vendors/${vendor.id}`}>
                       <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                         Details
                       </Button>
                     </Link>
                   </div>
                 </div>
               ))
             )}
           </div>
         </CardContent>
       </Card>

    </div>
  );
} 