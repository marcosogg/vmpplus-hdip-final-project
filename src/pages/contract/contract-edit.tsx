import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContractForm } from '@/components/contract/contract-form';
import { PageHeader } from '@/components/layout/page-header';
import { getContractById } from '@/lib/api/contracts';
import { useToast } from '@/hooks/use-toast';

export function ContractEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (!id) {
      setError('Contract ID is missing');
      setIsLoading(false);
      return;
    }

    async function loadContract() {
      setIsLoading(true);
      try {
        const { data, error } = await getContractById(id);

        if (error) {
          setError(error.message);
          toast({
            title: "Error",
            description: `Failed to load contract: ${error.message}`,
            variant: "destructive",
          });
          return;
        }

        if (!data) {
          setError('Contract not found');
          return;
        }

        // Prepare data for the form
        setInitialData({
          title: data.title,
          vendor_id: data.vendor_id,
          description: data.description || '',
          start_date: data.start_date,
          end_date: data.end_date,
          value: data.value.toString(),
          status: data.status
        });
      } catch (err) {
        console.error('Error loading contract:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    loadContract();
  }, [id, toast]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader
          title="Edit Contract"
          description="Loading contract details..."
        />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !initialData) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader
          title="Edit Contract"
          description="There was a problem loading the contract"
        />
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error || 'Contract not found'}</span>
          <div className="mt-4">
            <button 
              onClick={() => navigate('/app/contracts')}
              className="bg-white hover:bg-gray-100 text-red-700 font-semibold py-2 px-4 border border-red-300 rounded shadow"
            >
              Back to Contracts
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title={`Edit Contract: ${initialData.title}`}
        description="Update contract details"
      />
      
      <div className="mt-6">
        <ContractForm 
          initialData={initialData}
          contractId={id}
          onSuccess={() => {
            toast({
              title: "Success",
              description: "Contract updated successfully",
            });
            navigate(`/app/contracts/${id}`);
          }}
        />
      </div>
    </div>
  );
} 