import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createVendor, updateVendor, VendorInsert, VendorUpdate } from '@/lib/api/vendors';
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
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { vendorSchema, VendorFormData } from '@/schemas/vendor-schema';

// Define props for the form component
interface VendorFormProps {
  initialData?: VendorFormData;
  vendorId?: string;
  onSuccess?: () => void;
}

// Default form values matching the schema
const defaultValues: VendorFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  status: 'pending',
  notes: '',
  score: null
};

export function VendorForm({ initialData, vendorId, onSuccess }: VendorFormProps) {
  const isEditMode = !!vendorId;
  const navigate = useNavigate();
  const { toast } = useToast();

  // Setup react-hook-form
  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: initialData || defaultValues,
  });

  const { handleSubmit, control, reset, formState: { isSubmitting, errors } } = form;

  // Reset form if initialData changes (e.g., when switching views)
  useEffect(() => {
    reset(initialData || defaultValues);
  }, [initialData, reset]);

  // Form submission handler
  const onSubmit = async (data: VendorFormData) => {
    try {
      if (isEditMode && vendorId) {
        // Update existing vendor
        const { error } = await updateVendor(vendorId, data as VendorUpdate);
        
        if (error) {
          toast({
            title: "Error",
            description: `Failed to update vendor: ${error.message}`,
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Success",
          description: "Vendor updated successfully",
        });
      } else {
        // Create new vendor
        const { error } = await createVendor(data as VendorInsert);
        
        if (error) {
          toast({
            title: "Error",
            description: `Failed to create vendor: ${error.message}`,
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Success",
          description: "Vendor created successfully",
        });
        reset(); // Reset form after successful creation
      }
      
      // Handle success: call provided callback or navigate
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/app/vendors');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Display general form error if needed - could be enhanced */}
        {/* {errors.root && ( */}
        {/*   <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded"> */}
        {/*     {errors.root.message} */}
        {/*   </div> */}
        {/* )} */} 
        
        <div className="space-y-4">
          {/* Name field */}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter vendor name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Email field */}
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Enter email address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Phone field */}
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter phone number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Address field */}
          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter address" />
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Category field */}
          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter vendor category" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Rating/Score field */}
          <FormField
            control={control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (0-5)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="5" 
                    step="0.1" 
                    placeholder="Enter rating from 0 to 5"
                    value={field.value === null ? '' : field.value}
                    onChange={e => {
                      const value = e.target.value === '' ? null : Number(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Notes field */}
          <FormField
            control={control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Additional notes or comments"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/app/vendors')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Vendor' : 'Create Vendor'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 