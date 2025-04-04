import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getVendors, deleteVendor, Vendor } from '@/lib/api/vendors';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';

export function VendorListPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  
  // Check environment variables in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('Environment check:', { 
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL?.substring(0, 5) + '...',
        hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      });
    }
  }, []);

  useEffect(() => {
    // Debug auth state
    console.log('Auth state:', { isAuthenticated, userId: user?.id });
    
    if (isAuthenticated) {
      loadVendors();
    }
  }, [isAuthenticated, user]);

  async function loadVendors() {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if we have a valid session before making the request
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Current session:', { 
        hasSession: !!sessionData.session,
        userId: sessionData.session?.user?.id 
      });
      
      if (!sessionData.session) {
        setError('No active session found. Please log in again.');
        toast({
          title: "Authentication Error",
          description: "Your session may have expired. Please log in again.",
          variant: "destructive",
        });
        return;
      }
      
      const { data, error } = await getVendors();
      
      if (error) {
        console.error('Vendor fetch error:', error);
        setError(error.message || 'Failed to fetch vendors');
        toast({
          title: "Error Loading Vendors",
          description: error.message || 'An error occurred while loading vendors',
          variant: "destructive",
        });
        return;
      }
      
      setVendors(data || []);
    } catch (err) {
      console.error('Unexpected vendor fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteVendor(id: string) {
    try {
      const { error } = await deleteVendor(id);
      
      if (error) {
        toast({
          title: "Error",
          description: `Failed to delete vendor: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      // Remove from local state without refetching
      setVendors(vendors.filter(vendor => vendor.id !== id));
      
      toast({
        title: "Success",
        description: "Vendor deleted successfully",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const renderStatusBadge = (status: string) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    
    const statusClass = statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
        {status}
      </span>
    );
  };

  // Updated navigate paths
  const navigateToCreate = () => navigate('/app/vendors/new');
  const navigateToDetails = (id: string) => navigate(`/app/vendors/${id}`);
  const navigateToEdit = (id: string) => navigate(`/app/vendors/${id}/edit`);

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Vendors" 
        description="Manage your vendors and their information"
        actions={
          <Button onClick={navigateToCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        }
      />

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="p-4 mb-4 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
          Error: {error}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && vendors.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-900">No vendors found</h3>
          <p className="text-gray-500 mt-1">Get started by adding your first vendor</p>
          <Button onClick={navigateToCreate} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      )}

      {/* Vendor table */}
      {!isLoading && !error && vendors.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">
                    <Link to={`/app/vendors/${vendor.id}`} className="hover:underline text-primary">
                      {vendor.name}
                    </Link>
                  </TableCell>
                  <TableCell>{vendor.email || '-'}</TableCell>
                  <TableCell>{renderStatusBadge(vendor.status)}</TableCell>
                  <TableCell>{formatDate(vendor.created_at)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigateToDetails(vendor.id)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigateToEdit(vendor.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteVendor(vendor.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 