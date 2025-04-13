import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVendorById, deleteVendor, updateVendor, Vendor } from '@/lib/api/vendors';
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
import { EditIcon, Trash2Icon, FileIcon, CheckCircle } from 'lucide-react';
import { DocumentList } from '@/components/document/document-list';
import { DocumentUpload } from '@/components/document/document-upload';
import { useUserProfile } from '@/hooks/use-user-profile';

export function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole } = useUserProfile();
  
  // Check if user is admin
  const isAdmin = userRole === 'admin';
  
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showUploadDocumentDialog, setShowUploadDocumentDialog] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/app/vendors');
      return;
    }

    async function loadVendor() {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await getVendorById(id as string);
        
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
    setError(null);
    
    try {
      const { error: deleteError } = await deleteVendor(id);
      
      if (deleteError) {
        const errorMessage = `Failed to delete vendor: ${deleteError.message}`;
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsDeleting(false);
        return;
      }
      
      toast({
        title: "Success",
        description: "Vendor deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
      navigate('/app/vendors');
    } catch (err) {
      console.error(err);
      const errorMessage = "An unexpected error occurred while deleting the vendor";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      if (error) {
        setIsDeleting(false);
      }
    }
  };

  const handleDocumentUploadSuccess = () => {
    setShowUploadDocumentDialog(false);
    toast({
      title: "Success",
      description: "Document uploaded successfully",
    });
  };

  const handleApprove = async () => {
    if (!id || !vendor) return;
    
    try {
      const { data, error } = await updateVendor(id, { 
        status: 'active' 
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || 'Failed to approve vendor',
          variant: "destructive",
        });
        return;
      }
      
      setVendor(data);
      toast({
        title: "Success",
        description: "Vendor approved successfully",
      });
    } catch (err) {
      console.error('Error approving vendor:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
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

  // Render the rating stars
  const renderRating = (rating: number | null | undefined) => {
    if (rating === null || rating === undefined) return 'No rating';
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return (
              <svg 
                key={i} 
                className="h-5 w-5 text-yellow-400 fill-yellow-400" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            );
          } else if (i === fullStars && hasHalfStar) {
            return (
              <svg 
                key={i} 
                className="h-5 w-5 text-yellow-400 fill-yellow-400" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            );
          } else {
            return (
              <svg 
                key={i} 
                className="h-5 w-5 text-gray-300" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            );
          }
        })}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
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
            {isAdmin && vendor.status === 'pending' && (
              <Button
                variant="default"
                onClick={handleApprove}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Vendor
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate(`/app/vendors/${vendor.id}/edit`)}
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </Button>
            
            {isAdmin && (
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
            )}
          </div>
        }
      />
      
      <div className="grid grid-cols-1 gap-6 mt-6">
        {/* Vendor Details Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              {vendor.logo_url ? (
                <img 
                  src={vendor.logo_url} 
                  alt={`${vendor.name} logo`}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-xl font-medium">{vendor.name.charAt(0)}</span>
                </div>
              )}
              <div>
                <CardTitle>{vendor.name}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Vendor Details</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1">{vendor.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1">{renderStatusBadge(vendor.status)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                <div className="mt-1">{renderRating(vendor.rating)}</div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1">{vendor.email || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="mt-1">{vendor.phone || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="mt-1">{vendor.address || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created</h3>
                <p className="mt-1">{formatDate(vendor.created_at)}</p>
              </div>
            </div>
            
            {vendor.notes && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1 text-gray-900 whitespace-pre-line">{vendor.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Contracts section would go here */}
        
        {/* Documents section */}
        <div className="mt-6">
          <DocumentList 
            entityType="vendor"
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
                <DialogTitle>Upload Document for {vendor.name}</DialogTitle>
                <DialogDescription>
                  Add a document to this vendor record.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <DocumentUpload 
                  entityType="vendor"
                  entityId={id!}
                  onSuccess={handleDocumentUploadSuccess}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
} 