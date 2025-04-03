import { useNavigate } from 'react-router-dom';
import { ContractForm } from '@/components/contract/contract-form';
import { PageHeader } from '@/components/layout/page-header';

export function ContractCreatePage() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Create New Contract"
        description="Create a new contract with a vendor"
      />
      
      <div className="mt-6">
        <ContractForm onSuccess={() => navigate('/app/contracts')} />
      </div>
    </div>
  );
} 