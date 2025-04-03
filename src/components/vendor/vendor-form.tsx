import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useToast } from '@/hooks/use-toast';

// Define interface for form data
interface VendorFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  notes: string;
}

// Define props for the form component
interface VendorFormProps {
  initialData?: VendorFormValues;
  vendorId?: string;
  onSuccess?: () => void;
}

// Default form values
const defaultValues: VendorFormValues = {
  name: '',
  email: '',
  phone: '',
  address: '',
  status: 'pending',
  notes: ''
};

export function VendorForm({ initialData, vendorId, onSuccess }: VendorFormProps) {
  // Determine if this is an edit form
  const isEditMode = !!vendorId;
  
  // Initialize form state with provided data or defaults
  const [formData, setFormData] = useState<VendorFormValues>(initialData || defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle status select change
  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
  };
  
  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (isEditMode && vendorId) {
        // Update existing vendor
        const { data, error } = await updateVendor(vendorId, formData as VendorUpdate);
        
        if (error) {
          setError(error.message);
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
        const { data, error } = await createVendor(formData as VendorInsert);
        
        if (error) {
          setError(error.message);
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
      }
      
      // Handle success: call provided callback or navigate
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/app/vendors');
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
        {/* Name field */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter vendor name"
            aria-describedby="name-required"
          />
          <span id="name-required" className="sr-only">
            Name is required
          </span>
        </div>
        
        {/* Email field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
          />
        </div>
        
        {/* Phone field */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>
        
        {/* Address field */}
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
          />
        </div>
        
        {/* Status field */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Notes field */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Additional notes or comments"
          />
        </div>
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
  );
} 