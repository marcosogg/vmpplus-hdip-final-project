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

// Define interface for form data
interface ContractFormValues {
  title: string;
  vendor_id: string;
  description: string;
  start_date: string;
  end_date: string;
  value: string; // Use string for input, convert to number on submit
  status: string;
}

// Define props for the form component
interface ContractFormProps {
  initialData?: Partial<ContractFormValues>;
  contractId?: string;
  onSuccess?: () => void;
}

// Default form values
const defaultValues: ContractFormValues = {
  title: '',
  vendor_id: '',
  description: '',
  start_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // One year from today
  value: '0',
  status: 'draft'
};

// Helper to validate UUID format
const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export function ContractForm({ initialData, contractId, onSuccess }: ContractFormProps) {
  // Determine if this is an edit form
  const isEditMode = !!contractId;
  
  // Initialize form state with provided data or defaults
  const [formData, setFormData] = useState<ContractFormValues>({
    ...defaultValues,
    ...initialData
  });
  
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load vendors for dropdown
  useEffect(() => {
    async function loadVendors() {
      setIsLoadingVendors(true);
      try {
        const { data, error } = await getVendors();
        
        if (error) {
          console.error('Error loading vendors:', error);
          toast({
            title: "Error",
            description: `Failed to load vendors: ${error.message}`,
            variant: "destructive",
          });
          return;
        }
        
        setVendors(data || []);
      } catch (err) {
        console.error('Unexpected error loading vendors:', err);
      } finally {
        setIsLoadingVendors(false);
      }
    }
    
    loadVendors();
  }, [toast]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear date error when dates are changed
    if (name === 'start_date' || name === 'end_date') {
      setDateError(null);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select field changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Validate dates
  const validateDates = (): boolean => {
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    
    if (endDate < startDate) {
      setDateError('End date must be after start date');
      return false;
    }
    
    return true;
  };
  
  // Validate form data
  const validateForm = (): boolean => {
    // Validate dates
    if (!validateDates()) {
      return false;
    }
    
    // Validate vendor_id is a valid UUID
    if (!isValidUUID(formData.vendor_id)) {
      setError('Please select a valid vendor');
      return false;
    }
    
    return true;
  };
  
  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Convert value string to number
      const numericValue = parseFloat(formData.value) || 0;
      
      // Prepare data for API
      const contractData = {
        ...formData,
        value: numericValue
      };
      
      console.log('Submitting contract data:', contractData);
      
      if (isEditMode && contractId) {
        // Update existing contract
        const { data, error } = await updateContract(contractId, contractData as unknown as ContractUpdate);
        
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
        const { data, error } = await createContract(contractData as unknown as ContractInsert);
        
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
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded" role="alert">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title field */}
        <div className="space-y-2 md:col-span-2">
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
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="vendor_id">
            Vendor <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.vendor_id}
            onValueChange={(value) => handleSelectChange('vendor_id', value)}
            disabled={isLoadingVendors}
          >
            <SelectTrigger id="vendor_id">
              <SelectValue placeholder="Select a vendor" />
            </SelectTrigger>
            <SelectContent>
              {vendors.length === 0 && !isLoadingVendors && (
                <SelectItem value="no-vendors" disabled>
                  No vendors available
                </SelectItem>
              )}
              
              {isLoadingVendors && (
                <SelectItem value="loading" disabled>
                  Loading vendors...
                </SelectItem>
              )}
              
              {vendors.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!isValidUUID(formData.vendor_id) && (
            <p className="text-xs text-amber-600">
              Please select a vendor. If no vendors are available, you need to create one first.
            </p>
          )}
        </div>
        
        {/* Start Date field */}
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
            aria-describedby="date-error"
          />
        </div>
        
        {/* End Date field */}
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
            aria-describedby="date-error"
          />
        </div>
        
        {/* Date validation error */}
        {dateError && (
          <div className="col-span-2 p-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded" id="date-error" role="alert">
            {dateError}
          </div>
        )}
        
        {/* Value field */}
        <div className="space-y-2">
          <Label htmlFor="value">Contract Value</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="value"
              name="value"
              type="number"
              step="0.01"
              min="0"
              value={formData.value}
              onChange={handleChange}
              className="pl-8"
              placeholder="0.00"
            />
          </div>
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
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter contract description or additional details"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/app/contracts')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !isValidUUID(formData.vendor_id)}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Contract' : 'Create Contract'}
        </Button>
      </div>
    </form>
  );
} 