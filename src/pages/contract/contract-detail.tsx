import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getContractById, deleteContract, Contract } from '@/lib/api/contracts';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { FileIcon, Pencil, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  useEffect(() => {
    if (!id) {
      setError('Contract ID is missing');
      setIsLoading(false);
      return;
    }
    
    async function loadContract() {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await getContractById(id);
        
        if (error) {
          setError(error.message || 'Failed to load contract');
          toast({
            title: "Error",
            description: error.message || 'Failed to load contract',
            variant: "destructive",
          });
          return;
        }
        
        setContract(data);
      } catch (err) {
        console.error('Unexpected error loading contract:', err);
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
    
    loadContract();
  }, [id, toast]);
  
  const handleDelete = async () => {
    if (!id) return;
    
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
      
      toast({
        title: "Success",
        description: "Contract deleted successfully",
      });
      
      // Navigate back to the contracts list
      navigate('/app/contracts');
    } catch (err) {
      console.error('Delete error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
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
  
  // Navigation
  const navigateToEdit = () => id && navigate(`/app/contracts/${id}/edit`);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader title="Contract Details" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (error || !contract) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader title="Contract Details" />
        <div className="p-4 mt-6 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
          {error || 'Contract not found'}
        </div>
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => navigate('/app/contracts')}
          >
            Return to Contracts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title={contract.title}
        description="Contract details and related information"
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={navigateToEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Contract
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Contract
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Contract Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Contract Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">{renderStatusBadge(contract.status)}</dd>
              </div>
              
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">Vendor</dt>
                <dd className="mt-1">
                  {contract.vendors ? (
                    <Link to={`/app/vendors/${contract.vendor_id}`} className="text-blue-600 hover:underline">
                      {contract.vendors.name}
                    </Link>
                  ) : (
                    <span className="text-gray-400">Unknown vendor</span>
                  )}
                </dd>
              </div>
              
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                <dd className="mt-1">
                  {formatDate(contract.start_date)}
                </dd>
              </div>
              
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">End Date</dt>
                <dd className="mt-1">
                  {formatDate(contract.end_date)}
                </dd>
              </div>
              
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">Value</dt>
                <dd className="mt-1">
                  {formatCurrency(contract.value)}
                </dd>
              </div>
              
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1">
                  {formatDate(contract.created_at)}
                </dd>
              </div>
              
              {contract.description && (
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 whitespace-pre-line">
                    {contract.description}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Related Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* This will be replaced with actual documents list in a future phase */}
              <div className="p-4 bg-gray-50 rounded-md text-center">
                <FileIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">
                  Document management will be implemented in a future phase.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contract</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contract? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 