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
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getVendorCount } from '@/lib/api/vendors';
import { getContractCount, getExpiringContractCount } from '@/lib/api/contracts';
import { getDocumentCount } from '@/lib/api/documents';
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
        ] = await Promise.all([
          getVendorCount(),
          getContractCount(),
          getExpiringContractCount(),
        ]);

        if (vendorsResponse.error) throw new Error(vendorsResponse.error.message);
        if (contractsResponse.error) throw new Error(contractsResponse.error.message);
        if (expiringResponse.error) throw new Error(expiringResponse.error.message);

        setCounts({
          vendors: vendorsResponse.data ?? 0,
          contracts: contractsResponse.data ?? 0,
          expiring: expiringResponse.data ?? 0,
          documents: 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

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

  const vendorCategoriesData = {
    labels: ["IT Services", "Logistics", "Software", "Hardware", "Consulting", "Other"],
    datasets: [
      {
        label: "Vendors by Category",
        data: [4, 3, 5, 2, 3, 1],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(107, 114, 128, 0.8)",
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const contractStatusData = {
    labels: ["Active", "Pending", "Expiring Soon", "Expired"],
    datasets: [
      {
        label: "Contract Status",
        data: [5, 2, 3, 1],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(107, 114, 128, 0.8)",
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const spendByVendorData = {
    labels: ["Amazon Web Services", "Microsoft", "Salesforce", "Oracle", "Adobe", "Others"],
    datasets: [
      {
        label: "Spend by Vendor ($K)",
        data: [120, 85, 65, 45, 30, 55],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(107, 114, 128, 0.8)",
        ],
        borderRadius: 4,
      },
    ],
  };

  const recentVendors = [
    {
      id: "aws", name: "Amazon Web Services", category: "Cloud Services",
      logo: "https://logo.clearbit.com/amazon.com", status: "active" as const, contracts: 3,
    },
    {
      id: "fedex", name: "FedEx Logistics", category: "Shipping",
      logo: "https://logo.clearbit.com/fedex.com", status: "active" as const, contracts: 2,
    },
    {
      id: "ibm", name: "IBM Solutions", category: "IT Services",
      logo: "https://logo.clearbit.com/ibm.com", status: "pending" as const, contracts: 1,
    },
    {
      id: "msft", name: "Microsoft", category: "Software & Cloud",
      logo: "https://logo.clearbit.com/microsoft.com", status: "active" as const, contracts: 4,
    },
  ];

  const recentActivities = [
    {
      id: 1, type: "contract_signed" as const, vendor: "Amazon Web Services", time: "2 hours ago",
      icon: CheckCircle, iconColor: "text-green-500",
    },
    {
      id: 2, type: "document_submitted" as const, vendor: "IBM Solutions", time: "5 hours ago",
      icon: FileText, iconColor: "text-blue-500",
    },
    {
      id: 3, type: "contract_expiring" as const, vendor: "FedEx Logistics", time: "Yesterday",
      icon: AlertTriangle, iconColor: "text-amber-500", details: "expires in 30 days",
    },
    {
      id: 4, type: "rating_received" as const, vendor: "Adobe Systems", time: "2 days ago",
      icon: Star, iconColor: "text-purple-500", details: "received a 5-star rating",
    },
  ];

  const topRatedVendors = [
    {
      id: "sfdc", name: "Salesforce", category: "CRM Solutions",
      logo: "https://logo.clearbit.com/salesforce.com", rating: 4.8, status: "active" as const, contracts: 2,
    },
    {
      id: "msft2", name: "Microsoft", category: "Software & Cloud",
      logo: "https://logo.clearbit.com/microsoft.com", rating: 4.0, status: "active" as const, contracts: 4,
    },
    {
      id: "adobe", name: "Adobe Systems", category: "Creative Software",
      logo: "https://logo.clearbit.com/adobe.com", rating: 5.0, status: "pending" as const, contracts: 1,
    },
    {
      id: "oracle", name: "Oracle", category: "Database Solutions",
      logo: "https://logo.clearbit.com/oracle.com", rating: 4.2, status: "active" as const, contracts: 3,
    },
  ];

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
              title="Pending Approvals" 
              value={counts.expiring.toString()}
              change="+3 urgent"
              icon={AlertTriangle}
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
              isUrgent={true}
            />
            <SummaryCard 
              title="Avg. Rating" 
              value="4.2"
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
             <div className="h-[300px]">
               <DonutChart
                 data={vendorCategoriesData}
                 options={{
                   plugins: { legend: { position: 'right' as const } },
                 }}
               />
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
               <PieChart
                 data={contractStatusData}
                 options={{
                   plugins: { legend: { position: 'right' as const } },
                 }}
               />
             </div>
           </CardContent>
         </Card>

         <Card>
           <CardHeader>
             <CardTitle className="text-lg font-medium">Spend by Vendor</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="h-[250px]">
               <BarChart
                 data={spendByVendorData}
                 options={{
                   indexAxis: 'y' as const,
                   plugins: { legend: { display: true, position: 'top' as const } },
                   scales: { x: { beginAtZero: true } },
                 }}
               />
             </div>
           </CardContent>
         </Card>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-lg font-medium">Recent Vendors</CardTitle>
             <Button variant="link" size="sm" className="text-indigo-600 h-auto p-0">
               View All
             </Button>
           </CardHeader>
           <CardContent className="space-y-4">
             {recentVendors.map((vendor) => (
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
                     variant={ vendor.status === "active" ? "secondary" : "outline" }
                     className="text-[10px] px-1.5 py-0 leading-none"
                   >
                     {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                   </Badge>
                   <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                     View Details
                   </Button>
                 </div>
               </div>
             ))}
           </CardContent>
         </Card>

         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-lg font-medium">Recent Activities</CardTitle>
             <Button variant="link" size="sm" className="text-indigo-600 h-auto p-0">
               View All
             </Button>
           </CardHeader>
           <CardContent className="space-y-4">
             {recentActivities.map((activity) => {
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
             })}
           </CardContent>
         </Card>
       </div>

       <Card>
         <CardHeader className="flex flex-row items-center justify-between pb-2">
           <CardTitle className="text-lg font-medium">Top Rated Vendors</CardTitle>
           <Button variant="link" size="sm" className="text-indigo-600 h-auto p-0">
             View All
           </Button>
         </CardHeader>
         <CardContent>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {topRatedVendors.map((vendor) => (
               <div key={vendor.id} className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                   <Avatar className="h-12 w-12">
                     <AvatarImage src={vendor.logo} alt={vendor.name} />
                     <AvatarFallback>{vendor.name.substring(0, 2)}</AvatarFallback>
                   </Avatar>
                   <Badge
                     variant={ vendor.status === "active" ? "secondary" : "outline" }
                     className="text-[10px] px-1.5 py-0 leading-none"
                   >
                     {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                   </Badge>
                 </div>
                 <h3 className="font-semibold text-base mb-1">{vendor.name}</h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{vendor.category}</p>
                 <div className="flex items-center mb-3">
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
                   <span className="ml-2 text-xs font-medium">{vendor.rating.toFixed(1)}</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                   <span>
                     {vendor.contracts} {vendor.contracts === 1 ? "contract" : "contracts"}
                   </span>
                   <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                     Details
                   </Button>
                 </div>
               </div>
             ))}
           </div>
         </CardContent>
       </Card>

    </div>
  );
} 