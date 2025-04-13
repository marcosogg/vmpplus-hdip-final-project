import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVendorById, Vendor } from '@/lib/api/vendors';
import { VendorForm } from '@/components/vendor/vendor-form';
import { PageHeader } from '@/components/layout/page-header';
import { useToast } from '@/hooks/use-toast';
import { VendorFormData } from '@/schemas/vendor-schema';

export function VendorEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          toast({
            title: "Error",
            description: `Failed to load vendor: ${error.message}`,
            variant: "destructive",
          });
          return;
        }
        
        if (!data) {
          setError('Vendor not found');
          toast({
            title: "Error",
            description: "Vendor not found",
            variant: "destructive",
          });
          return;
        }
        
        setVendor({
          ...data,
          status: data.status as VendorFormData['status']
        });
      } catch (err) {
        console.error(err);
        setError('An unexpected error occurred');
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadVendor();
  }, [id, navigate, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader title="Edit Vendor" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader title="Edit Vendor" />
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
        title={`Edit Vendor: ${vendor.name}`}
        description="Update vendor information" 
      />
      
      <div className="mt-6">
        <VendorForm
          initialData={vendor as unknown as VendorFormData}
          vendorId={vendor.id}
        />
      </div>
    </div>
  );
} 