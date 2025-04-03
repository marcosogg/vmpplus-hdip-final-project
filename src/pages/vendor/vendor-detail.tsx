import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVendorById, deleteVendor, Vendor } from '@/lib/api/vendors';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { EditIcon, Trash2Icon, FileIcon } from 'lucide-react';

export function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/app/vendors');
      return;
    }

    async function loadVendor() {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await getVendorById(id);
        
        if (error) {
          setError(error.message);
          return;
        }
        
        if (!data) {
          setError('Vendor not found');
          return;
        }
        
        setVendor(data);
      } catch (err) {
        console.error(err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadVendor();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    
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
      
      toast({
        title: "Success",
        description: "Vendor deleted successfully",
      });
      
      navigate('/app/vendors');
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader title="Vendor Details" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader title="Vendor Details" />
        <div className="p-4 mt-6 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
          {error || 'Vendor not found'}
        </div>
        <div className="mt-4">
          <button 
            onClick={() => navigate('/app/vendors')}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Return to Vendors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title={vendor.name}
        description="Vendor details and related information"
        actions={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/app/vendors/${vendor.id}/edit`)}
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </Button>
            
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Vendor</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete {vendor.name}? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Vendor Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Vendor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">{renderStatusBadge(vendor.status)}</dd>
              </div>
              
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1">
                  {vendor.email ? (
                    <a href={`mailto:${vendor.email}`} className="text-blue-600 hover:underline">
                      {vendor.email}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </dd>
              </div>
              
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1">
                  {vendor.phone ? (
                    <a href={`tel:${vendor.phone}`} className="text-blue-600 hover:underline">
                      {vendor.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </dd>
              </div>
              
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1">
                  {vendor.address || <span className="text-gray-400">Not provided</span>}
                </dd>
              </div>
              
              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 whitespace-pre-wrap">
                  {vendor.notes || <span className="text-gray-400">No notes</span>}
                </dd>
              </div>
              
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1">{formatDate(vendor.created_at)}</dd>
              </div>
              
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1">{formatDate(vendor.updated_at)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        {/* Related Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Related Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Contracts</h3>
                {/* This will be replaced with actual contracts list in a future phase */}
                <div className="p-4 bg-gray-50 rounded-md text-center">
                  <p className="text-gray-400 text-sm">
                    Contract management will be implemented in a future phase.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Documents</h3>
                {/* This will be replaced with actual documents list in a future phase */}
                <div className="p-4 bg-gray-50 rounded-md text-center">
                  <FileIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">
                    Document management will be implemented in a future phase.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 