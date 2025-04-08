import { z } from 'zod';

export const vendorSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }).optional().or(z.literal('')), // Optional but must be valid email if provided
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'pending'], {
    errorMap: () => ({ message: 'Please select a valid status' }),
  }),
  notes: z.string().optional().or(z.literal('')),
});

// Type for form data derived from the schema
export type VendorFormData = z.infer<typeof vendorSchema>; 