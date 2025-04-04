import { VendorForm } from '@/components/vendor/vendor-form';
import { PageHeader } from '@/components/layout/page-header';

export function VendorCreatePage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Create Vendor" 
        description="Add a new vendor to your system" 
      />
      
      <div className="mt-6">
        <VendorForm />
      </div>
    </div>
  );
} 