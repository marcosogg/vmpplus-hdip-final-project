import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createContract, updateContract, ContractInsert, ContractUpdate } from '@/lib/api/contracts';
import { getVendors, Vendor } from '@/lib/api/vendors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Define interface for form data
interface ContractFormValues {
  title: string;
  vendor_id: string;
  description: string;
  start_date: string;
  end_date: string;
  value: number;
  status: string;
}

// Define props for the form component
interface ContractFormProps {
  initialData?: Partial<ContractFormValues>;
  contractId?: string;
  onSuccess?: () => void;
}

export function ContractForm({ initialData, contractId, onSuccess }: ContractFormProps) {
  // Determine if this is an edit form
  const isEditMode = !!contractId;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for form data
  const [formData, setFormData] = useState<ContractFormValues>({
    title: initialData?.title || '',
    vendor_id: initialData?.vendor_id || '',
    description: initialData?.description || '',
    start_date: initialData?.start_date ? format(new Date(initialData.start_date), 'yyyy-MM-dd') : '',
    end_date: initialData?.end_date ? format(new Date(initialData.end_date), 'yyyy-MM-dd') : '',
    value: initialData?.value || 0,
    status: initialData?.status || 'draft'
  });
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for vendors list (for dropdown)
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  
  // Load vendors for the dropdown
  useEffect(() => {
    async function loadVendors() {
      setVendorsLoading(true);
      try {
        const { data, error } = await getVendors();
        if (error) {
          console.error('Error loading vendors:', error);
          return;
        }
        setVendors(data || []);
      } catch (err) {
        console.error('Unexpected error loading vendors:', err);
      } finally {
        setVendorsLoading(false);
      }
    }
    
    loadVendors();
  }, []);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select field changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle number field change (value)
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };
  
  // Validate form
  const validateForm = (): boolean => {
    // Required fields
    if (!formData.title || !formData.vendor_id || !formData.start_date || !formData.end_date) {
      setError('Please fill in all required fields');
      return false;
    }
    
    // Start date must be before or equal to end date
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    if (startDate > endDate) {
      setError('End date must be after or equal to start date');
      return false;
    }
    
    return true;
  };
  
  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (isEditMode && contractId) {
        // Update existing contract
        const { data, error } = await updateContract(contractId, formData as ContractUpdate);
        
        if (error) {
          setError(error.message);
          toast({
            title: "Error",
            description: `Failed to update contract: ${error.message}`,
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Success",
          description: "Contract updated successfully",
        });
      } else {
        // Create new contract
        const { data, error } = await createContract(formData as ContractInsert);
        
        if (error) {
          setError(error.message);
          toast({
            title: "Error",
            description: `Failed to create contract: ${error.message}`,
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Success",
          description: "Contract created successfully",
        });
      }
      
      // Handle success: call provided callback or navigate
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/app/contracts');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {/* Title field */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter contract title"
            aria-describedby="title-required"
          />
          <span id="title-required" className="sr-only">
            Title is required
          </span>
        </div>
        
        {/* Vendor selection */}
        <div className="space-y-2">
          <Label htmlFor="vendor_id">
            Vendor <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.vendor_id}
            onValueChange={(value) => handleSelectChange('vendor_id', value)}
            disabled={vendorsLoading}
          >
            <SelectTrigger id="vendor_id">
              <SelectValue placeholder="Select a vendor" />
            </SelectTrigger>
            <SelectContent>
              {vendors.map(vendor => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {vendorsLoading && <p className="text-xs text-gray-500">Loading vendors...</p>}
        </div>
        
        {/* Start date field */}
        <div className="space-y-2">
          <Label htmlFor="start_date">
            Start Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* End date field */}
        <div className="space-y-2">
          <Label htmlFor="end_date">
            End Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Value field */}
        <div className="space-y-2">
          <Label htmlFor="value">Contract Value</Label>
          <Input
            id="value"
            name="value"
            type="number"
            step="0.01"
            min="0"
            value={formData.value}
            onChange={handleNumberChange}
            placeholder="Enter contract value"
          />
        </div>
        
        {/* Status field */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Description field */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter contract description"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/app/contracts')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Contract' : 'Create Contract'}
        </Button>
      </div>
    </form>
  );
} 