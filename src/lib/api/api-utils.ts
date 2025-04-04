import { ApiResponse, ApiError } from '@/types/api';
import { PostgrestError } from '@supabase/supabase-js';

export async function handleApiError<T>(
  promiseOrFunction: Promise<T> | (() => Promise<T>)
): Promise<ApiResponse<T>> {
  try {
    // Handle both Promise and function that returns Promise
    const data = typeof promiseOrFunction === 'function' 
      ? await promiseOrFunction() 
      : await promiseOrFunction;
    
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    
    let message = 'An unknown error occurred';
    let details = error;
    let status = undefined;
    
    // Handle PostgrestError from Supabase
    if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
      const pgError = error as PostgrestError;
      message = pgError.message;
      status = pgError.code;
      details = {
        code: pgError.code,
        details: pgError.details,
        hint: pgError.hint
      };
    } else if (error instanceof Error) {
      message = error.message;
    }
    
    const apiError: ApiError = {
      message,
      status,
      details
    };
    
    return { data: null, error: apiError };
  }
} 