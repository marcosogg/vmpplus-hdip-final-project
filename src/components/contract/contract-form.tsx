import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createContract, updateContract, ContractInsert, ContractUpdate } from '@/lib/api/contracts';
import { getVendors, Vendor } from '@/lib/api/vendors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { contractSchema, ContractFormData } from '@/schemas/contract-schema';

// Define props for the form component
interface ContractFormProps {
  initialData?: Partial<ContractFormData>;
  contractId?: string;
  onSuccess?: () => void;
}

// Helper function to format date for input type="date"
const formatDateForInput = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (e) {
    return ''; // Return empty if date is invalid
  }
};

// Default form values matching the schema
const defaultValues: ContractFormData = {
  title: '',
  vendor_id: '', // Empty string, user must select
  description: '',
  start_date: formatDateForInput(new Date().toISOString()), // Today's date
  end_date: formatDateForInput(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()), // One year from today
  value: '', // Represent as string for input
  status: 'draft'
};

export function ContractForm({ initialData, contractId, onSuccess }: ContractFormProps) {
  const isEditMode = !!contractId;
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Prepare initial form values, formatting dates correctly
  const preparedInitialData = initialData ? {
    ...defaultValues,
    ...initialData,
    start_date: formatDateForInput(initialData.start_date),
    end_date: formatDateForInput(initialData.end_date),
    value: initialData.value?.toString() || '', // Ensure value is string
  } : defaultValues;

  // Setup react-hook-form
  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: preparedInitialData,
    mode: 'onChange', // Validate on change for better UX with date comparison
  });

  const { handleSubmit, control, reset, formState: { isSubmitting, errors } } = form;

  // Reset form if initialData changes
  useEffect(() => {
    reset(preparedInitialData);
  }, [initialData, reset]); // Dependency on initialData directly

  // Load vendors for dropdown
  useEffect(() => {
    async function loadVendors() {
      setIsLoadingVendors(true);
      try {
        const { data, error } = await getVendors();
        if (error) {
          console.error('Error loading vendors:', error);
          toast({ title: "Error", description: `Failed to load vendors: ${error.message}`, variant: "destructive" });
          return;
        }
        setVendors(data || []);
      } catch (err) {
        console.error('Unexpected error loading vendors:', err);
        toast({ title: "Error", description: "Failed to load vendors", variant: "destructive" });
      } finally {
        setIsLoadingVendors(false);
      }
    }
    loadVendors();
  }, [toast]);

  // Form submission handler
  const onSubmit = async (data: ContractFormData) => {
    try {
      // Convert value string to number for API
      const numericValue = data.value ? parseFloat(data.value) : 0;
      
      // Prepare data for API
      const contractDataForApi = {
        ...data,
        value: numericValue,
        // Dates are already in YYYY-MM-DD format from input
      };

      if (isEditMode && contractId) {
        // Update existing contract
        const { error } = await updateContract(contractId, contractDataForApi as unknown as ContractUpdate);
        if (error) {
          toast({ title: "Error", description: `Failed to update contract: ${error.message}`, variant: "destructive" });
          return;
        }
        toast({ title: "Success", description: "Contract updated successfully" });
      } else {
        // Create new contract
        const { error } = await createContract(contractDataForApi as unknown as ContractInsert);
        if (error) {
          toast({ title: "Error", description: `Failed to create contract: ${error.message}`, variant: "destructive" });
          return;
        }
        toast({ title: "Success", description: "Contract created successfully" });
        reset(defaultValues); // Reset to defaults after creation
      }
      
      // Handle success
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/app/contracts');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      toast({ title: "Error", description: "An unexpected error occurred during submission", variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title field */}
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Title <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter contract title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Vendor selection */}
          <FormField
            control={control}
            name="vendor_id"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Vendor <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingVendors}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vendor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingVendors ? (
                      <SelectItem value="loading" disabled>Loading vendors...</SelectItem>
                    ) : vendors.length === 0 ? (
                      <SelectItem value="no-vendors" disabled>No vendors available</SelectItem>
                    ) : (
                      vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {vendors.length === 0 && !isLoadingVendors && "You must create a vendor first."} 
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Start Date field */}
          <FormField
            control={control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* End Date field */}
          <FormField
            control={control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                {/* Display Zod refinement error here */}
                <FormMessage /> 
              </FormItem>
            )}
          />
          
          {/* Value field */}
          <FormField
            control={control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Value</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input 
                      {...field} 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Status field */}
          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Description field */}
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter contract description or additional details"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Contract' : 'Create Contract'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 