import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContractById, Contract } from '@/lib/api/contracts';
import { ContractForm } from '@/components/contract/contract-form';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function ContractEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader title="Edit Contract" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (error || !contract) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader title="Edit Contract" />
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
        title={`Edit Contract: ${contract.title}`}
        description="Update contract information" 
      />
      
      <div className="mt-6">
        <ContractForm
          initialData={contract}
          contractId={contract.id}
        />
      </div>
    </div>
  );
} 