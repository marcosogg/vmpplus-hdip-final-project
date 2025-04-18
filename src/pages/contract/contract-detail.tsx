import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getContractById, deleteContract, updateContract, Contract } from '@/lib/api/contracts';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Edit, MoreVertical, Trash2, FileText, AlertTriangle } from 'lucide-react';
import { DocumentList } from '@/components/document/document-list';
import { DocumentUpload } from '@/components/document/document-upload';
import { useUserProfile } from '@/hooks/use-user-profile';

export function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadDocumentDialog, setShowUploadDocumentDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole } = useUserProfile();
  
  // Check if user is admin
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    if (id) {
      loadContract(id);
    } else {
      setError('Contract ID is missing');
      setIsLoading(false);
    }
  }, [id]);

  async function loadContract(contractId: string) {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getContractById(contractId);
      
      if (error) {
        console.error('Contract fetch error:', error);
        setError(error.message || 'Failed to fetch contract details');
        toast({
          title: "Error Loading Contract",
          description: error.message || 'An error occurred while loading contract details',
          variant: "destructive",
        });
        return;
      }
      
      if (!data) {
        setError('Contract not found');
        return;
      }
      
      setContract(data);
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

  const handleDeleteContract = async () => {
    if (!id) return;
    
    if (!window.confirm('Are you sure you want to delete this contract?')) {
      return;
    }
    
    setError(null);
    
    try {
      const { error: deleteError } = await deleteContract(id);
      
      if (deleteError) {
        const errorMessage = `Failed to delete contract: ${deleteError.message}`;
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Success",
        description: "Contract deleted successfully",
      });
      
      navigate('/app/contracts');
    } catch (err) {
      console.error(err);
      const errorMessage = "An unexpected error occurred while deleting the contract";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleToggleUrgency = async () => {
    if (!id || !contract) return;
    
    try {
      const { data, error } = await updateContract(id, { 
        is_urgent: !contract.is_urgent 
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || 'Failed to update contract urgency',
          variant: "destructive",
        });
        return;
      }
      
      if (data) {
        setContract(data);
        toast({
          title: "Success",
          description: `Contract ${data.is_urgent ? 'marked as urgent' : 'urgency removed'}`,
        });
      }
    } catch (err) {
      console.error('Error toggling urgency:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDocumentUploadSuccess = () => {
    setShowUploadDocumentDialog(false);
    toast({
      title: "Success",
      description: "Document uploaded successfully",
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>
        {status}
      </span>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !contract) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error || 'Contract not found'}</span>
          <div className="mt-4">
            <Button onClick={() => navigate('/app/contracts')}>
              Back to Contracts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title={contract.title}
        description={
          <div className="flex items-center gap-3 mt-1">
            <span>Contract with </span>
            {contract.vendors?.name && (
              <Link 
                to={`/app/vendors/${contract.vendor_id}`} 
                className="font-medium text-primary hover:underline"
              >
                {contract.vendors.name}
              </Link>
            )}
            <span className="ml-3">{renderStatusBadge(contract.status)}</span>
            {contract.is_urgent && (
              <span className="ml-3 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                Urgent
              </span>
            )}
          </div>
        }
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/app/contracts/${id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Contract
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuItem onClick={handleToggleUrgency}>
                    {contract.is_urgent ? (
                      <>
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Remove Urgency
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Mark as Urgent
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleDeleteContract}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Contract
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contract Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contract Duration</h3>
                <p className="mt-1">
                  {formatDate(contract.start_date)} to {formatDate(contract.end_date)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contract Value</h3>
                <p className="mt-1 text-lg font-semibold">
                  ${contract.value.toLocaleString()}
                </p>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <div className="mt-1 bg-gray-50 p-3 rounded-md">
                {contract.description ? (
                  <p>{contract.description}</p>
                ) : (
                  <p className="text-gray-400 italic">No description provided</p>
                )}
              </div>
            </div>
            
            {/* Created and modified dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 pt-4 border-t">
              <div>
                <span>Created: {formatDate(contract.created_at)}</span>
              </div>
              <div>
                <span>Last Updated: {formatDate(contract.updated_at)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contract.vendors?.logo_url && (
                <div className="flex justify-center">
                  <img
                    src={contract.vendors.logo_url}
                    alt={`${contract.vendors.name} logo`}
                    className="h-24 w-24 object-contain rounded-lg"
                  />
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Vendor</h3>
                <p className="mt-1 font-medium">
                  {contract.vendors?.name || 'Unknown Vendor'}
                </p>
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate(`/app/vendors/${contract.vendor_id}`)}
                >
                  View Vendor Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Section */}
      <div className="mt-6">
        <DocumentList 
          entityType="contract"
          entityId={id!}
          showUploadButton
          onUploadClick={() => setShowUploadDocumentDialog(true)}
        />
        
        {/* Upload Document Dialog */}
        <Dialog 
          open={showUploadDocumentDialog} 
          onOpenChange={setShowUploadDocumentDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document for {contract.title}</DialogTitle>
              <DialogDescription>
                Add a document to this contract record.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <DocumentUpload 
                entityType="contract"
                entityId={id!}
                onSuccess={handleDocumentUploadSuccess}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 