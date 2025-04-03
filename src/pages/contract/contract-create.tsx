import { ContractForm } from '@/components/contract/contract-form';
import { PageHeader } from '@/components/layout/page-header';

export function ContractCreatePage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Create Contract" 
        description="Add a new contract to your system" 
      />
      
      <div className="mt-6">
        <ContractForm />
      </div>
    </div>
  );
} 