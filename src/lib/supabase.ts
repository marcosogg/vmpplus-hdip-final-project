import { createClient } from '@supabase/supabase-js';
// Import Database type (will be created in the next step)
import { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Environment variable validation
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Check .env file and ensure variables start with VITE_'
  );
}

// Use the Database generic type for full type safety
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export auth for convenience
export const auth = supabase.auth; 