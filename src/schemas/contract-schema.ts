import { z } from 'zod';

// Basic UUID validation regex
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const contractSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  vendor_id: z.string().regex(uuidRegex, { message: 'Please select a valid vendor' }),
  description: z.string().optional().or(z.literal('')),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Please enter a valid start date (YYYY-MM-DD)' }),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Please enter a valid end date (YYYY-MM-DD)' }),
  // Validate value as a number string, convert later
  value: z.string().regex(/^\d*\.?\d{0,2}$/, { message: 'Please enter a valid monetary value (e.g., 123.45)' }).optional().or(z.literal('')),
  status: z.enum(['draft', 'active', 'completed', 'terminated'], {
    errorMap: () => ({ message: 'Please select a valid status' }),
  }),
  is_urgent: z.boolean().default(false),
}).refine(data => {
  // Check if both dates are valid before comparing
  if (data.start_date && data.end_date && /^\d{4}-\d{2}-\d{2}$/.test(data.start_date) && /^\d{4}-\d{2}-\d{2}$/.test(data.end_date)) {
    return new Date(data.end_date) >= new Date(data.start_date);
  }
  return true; // Skip comparison if dates are not yet valid
}, {
  message: "End date cannot be earlier than start date",
  path: ["end_date"], // Attach error specifically to end_date field
});

// Type for form data derived from the schema
export type ContractFormData = z.infer<typeof contractSchema>; 