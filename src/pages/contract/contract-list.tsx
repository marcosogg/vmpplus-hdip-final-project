import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getContracts, deleteContract, Contract } from '@/lib/api/contracts';
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
import { MoreHorizontal, PlusCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';

export function ContractListPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadContracts();
    }
  }, [isAuthenticated]);

  async function loadContracts() {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getContracts();
      
      if (error) {
        console.error('Contract fetch error:', error);
        setError(error.message || 'Failed to fetch contracts');
        toast({
          title: "Error Loading Contracts",
          description: error.message || 'An error occurred while loading contracts',
          variant: "destructive",
        });
        return;
      }
      
      setContracts(data || []);
    } catch (err) {
      console.error('Unexpected contract fetch error:', err);
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

  async function handleDeleteContract(id: string) {
    try {
      const { error } = await deleteContract(id);
      
      if (error) {
        toast({
          title: "Error",
          description: `Failed to delete contract: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      // Remove from local state without refetching
      setContracts(contracts.filter(contract => contract.id !== id));
      
      toast({
        title: "Success",
        description: "Contract deleted successfully",
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const renderStatusBadge = (status: string) => {
    const statusClasses = {
      draft: "bg-gray-100 text-gray-800",
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      terminated: "bg-red-100 text-red-800",
    };
    
    const statusClass = statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
        {status}
      </span>
    );
  };

  // Navigation functions
  const navigateToCreate = () => navigate('/app/contracts/new');
  const navigateToDetails = (id: string) => navigate(`/app/contracts/${id}`);
  const navigateToEdit = (id: string) => navigate(`/app/contracts/${id}/edit`);

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Contracts" 
        description="Manage your vendor contracts and agreements"
        actions={
          <Button onClick={navigateToCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Contract
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
      {!isLoading && !error && contracts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FileText className="h-10 w-10 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-900">No contracts found</h3>
          <p className="text-gray-500 mt-1">Get started by adding your first contract</p>
          <Button onClick={navigateToCreate} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Contract
          </Button>
        </div>
      )}

      {/* Contract table */}
      {!isLoading && !error && contracts.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">
                    <Link to={`/app/contracts/${contract.id}`} className="hover:underline text-primary">
                      {contract.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {contract.vendors?.name || '-'}
                  </TableCell>
                  <TableCell>{renderStatusBadge(contract.status)}</TableCell>
                  <TableCell>{formatDate(contract.start_date)}</TableCell>
                  <TableCell>{formatDate(contract.end_date)}</TableCell>
                  <TableCell>{formatCurrency(contract.value)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigateToDetails(contract.id)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigateToEdit(contract.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteContract(contract.id)}
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