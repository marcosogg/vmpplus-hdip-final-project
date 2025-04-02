import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Environment variable validation
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Check .env file and ensure variables start with VITE_'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export auth for convenience
export const auth = supabase.auth; 