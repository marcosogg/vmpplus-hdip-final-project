import { supabase } from '@/lib/supabase';
import { handleApiError } from './api-utils';
import { ApiResponse } from '@/types/api';

// Type for chart data structure (example for line chart)
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
    pointBackgroundColor?: string;
    pointBorderColor?: string;
    pointHoverBackgroundColor?: string;
    pointHoverBorderColor?: string;
    spanGaps?: boolean;
  }[];
}

// Type for Donut/Pie chart data structure
export interface CategoryChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

// Type for Bar chart data structure (Spend by Vendor)
export interface SpendChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderRadius?: number;
  }[];
}

// Function to get scores of most recent vendors
export async function getRecentVendorScores(limit: number = 10): Promise<ApiResponse<ChartData>> {

  return handleApiError(async () => {
    // Simple query to get name and score of N most recent vendors with a score
    const { data: results, error } = await supabase
      .from('vendors')
      .select('name, score')
      .not('score', 'is', null) // Only vendors with a score
      .order('created_at', { ascending: false }) // Most recent first
      .limit(limit);

    if (error) {
      console.error(`Error fetching recent vendor scores:`, error);
      throw error;
    }

    if (!results || results.length === 0) {
        // Return empty structure if no data
        return { labels: [], datasets: [{ label: "Recent Vendor Scores", data: [] }] }; 
    }
    
    // Reverse the results to get chronological order for the chart (oldest of the recent first)
    const chronologicalResults = results.reverse();

    // Transform the results into ChartData format
    const labels: string[] = [];
    const dataPoints: (number | null)[] = []; // Keep type compatible, though nulls aren't expected here

    chronologicalResults.forEach((row: any) => {
      labels.push(row.name || 'Unknown'); // Use vendor name as label
      dataPoints.push(Number(row.score)); // Score should not be null due to query filter
    });

    const chartData: ChartData = {
      labels: labels,
      datasets: [
        {
          label: "Recent Vendor Scores", // Updated label
          data: dataPoints.filter(p => p !== null) as number[],
          borderColor: "rgb(234, 88, 12)", // Keep orange color
          backgroundColor: "rgba(234, 88, 12, 0.1)",
          tension: 0.1, // Lower tension for potentially less smooth data
          pointBackgroundColor: "rgb(234, 88, 12)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(234, 88, 12)",
          // spanGaps: false // Not needed as we filter out null scores
        },
      ],
    };

    return chartData;
  });
}

// Function to get vendor category distribution using database function
export async function getVendorCategoryDistribution(filterCategory?: string | null): Promise<ApiResponse<CategoryChartData>> {

  return handleApiError(async () => {
    // Prepare RPC parameters - pass the filter or null
    const rpcParams = { filter_category: filterCategory || null }; 

    // Call the RPC function
    const { data: results, error } = await supabase.rpc(
      'get_vendor_category_distribution',
      rpcParams
    );

    if (error) {
      console.error("Error calling RPC function get_vendor_category_distribution:", error);
      throw error;
    }

    if (!results) {
      return { labels: [], datasets: [{ label: "Vendors by Category", data: [] }] }; // Return empty structure
    }

    // Transform the results into CategoryChartData format
    const labels: string[] = [];
    const dataPoints: number[] = [];

    results.forEach((row: any) => {
      labels.push(row.label || 'Uncategorized'); // Use label from result
      dataPoints.push(Number(row.count || 0));  // Use count from result
    });

    // Define background colors (maintain consistency or generate dynamically if needed)
    const backgroundColors = [
      "rgba(99, 102, 241, 0.8)",  // Indigo
      "rgba(59, 130, 246, 0.8)",   // Blue
      "rgba(16, 185, 129, 0.8)",   // Emerald
      "rgba(245, 158, 11, 0.8)",  // Amber
      "rgba(239, 68, 68, 0.8)",    // Red
      "rgba(107, 114, 128, 0.8)", // Gray
      // Add more colors if you expect more categories
      "rgba(168, 85, 247, 0.8)",  // Purple
      "rgba(217, 70, 239, 0.8)",  // Fuchsia
      "rgba(34, 197, 94, 0.8)",  // Green
      "rgba(249, 115, 22, 0.8)"   // Orange
    ];

    const chartData: CategoryChartData = {
      labels: labels,
      datasets: [
        {
          label: "Vendors by Category",
          data: dataPoints,
          // Assign colors based on the number of labels
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };

    return chartData;
  });
}

// Function to get contract status distribution using database function
export async function getContractStatusDistribution(): Promise<ApiResponse<CategoryChartData>> {

  return handleApiError(async () => {
    // Call the RPC function (no parameters needed)
    const { data: results, error } = await supabase.rpc(
      'get_contract_status_distribution'
    );

    if (error) {
      console.error("Error calling RPC function get_contract_status_distribution:", error);
      throw error;
    }

    if (!results) {
      return { labels: [], datasets: [{ label: "Contract Status", data: [] }] }; // Return empty structure
    }

    // Transform the results into CategoryChartData format
    const labels: string[] = [];
    const dataPoints: number[] = [];

    results.forEach((row: any) => {
      // Capitalize the status label for display
      const statusLabel = row.label ? row.label.charAt(0).toUpperCase() + row.label.slice(1) : 'Unknown';
      labels.push(statusLabel); 
      dataPoints.push(Number(row.count || 0));  // Use count from result
    });

    // Define background colors based on common contract statuses (adjust as needed)
    const statusColorMap: { [key: string]: string } = {
      'Active': "rgba(16, 185, 129, 0.8)",   // Emerald
      'Draft': "rgba(107, 114, 128, 0.8)", // Gray
      'Pending': "rgba(245, 158, 11, 0.8)",  // Amber
      'Completed': "rgba(59, 130, 246, 0.8)",   // Blue
      'Terminated': "rgba(239, 68, 68, 0.8)",    // Red
      'Expired': "rgba(168, 85, 247, 0.8)",  // Purple (Example for Expired)
      'Unknown': "rgba(156, 163, 175, 0.8)", // Lighter Gray
    };
    
    const backgroundColors = labels.map(label => statusColorMap[label] || statusColorMap['Unknown']);

    const chartData: CategoryChartData = {
      labels: labels,
      datasets: [
        {
          label: "Contract Status",
          data: dataPoints,
          backgroundColor: backgroundColors,
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };

    return chartData;
  });
}

// Function to get spend by vendor data using database function
export async function getSpendByVendor(limit: number = 6): Promise<ApiResponse<SpendChartData>> {

  return handleApiError(async () => {
    // Prepare RPC parameters
    const rpcParams = { limit_param: limit }; 

    // Call the RPC function
    const { data: results, error } = await supabase.rpc(
      'get_vendor_spend',
      rpcParams
    );

    if (error) {
      console.error("Error calling RPC function get_vendor_spend:", error);
      throw error;
    }

    if (!results) {
      return { labels: [], datasets: [{ label: "Spend by Vendor ($K)", data: [] }] }; // Return empty structure
    }

    // Transform the results into SpendChartData format
    const labels: string[] = [];
    const dataPoints: number[] = [];

    results.forEach((row: any) => {
      labels.push(row.label || 'Unknown Vendor'); // Use vendor name from result
      // Assuming spend is in whole dollars, convert to $K for the chart
      dataPoints.push(Number(row.total_spend || 0) / 1000); 
    });

    // Define background colors (use the same set as categories for consistency)
    const backgroundColors = [
      "rgba(99, 102, 241, 0.8)",
      "rgba(59, 130, 246, 0.8)",
      "rgba(16, 185, 129, 0.8)",
      "rgba(245, 158, 11, 0.8)",
      "rgba(239, 68, 68, 0.8)",
      "rgba(107, 114, 128, 0.8)",
      "rgba(168, 85, 247, 0.8)", 
      "rgba(217, 70, 239, 0.8)",
      "rgba(34, 197, 94, 0.8)", 
      "rgba(249, 115, 22, 0.8)"
    ];

    const chartData: SpendChartData = {
      labels: labels,
      datasets: [
        {
          label: "Spend by Vendor ($K)",
          data: dataPoints,
          // Assign colors based on the number of labels/vendors
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderRadius: 4,
        },
      ],
    };

    return chartData;
  });
} 