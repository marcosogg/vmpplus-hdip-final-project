import { ApiResponse, ApiError } from '@/types/api';

export async function handleApiError<T>(
  promise: Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      details: error
    };
    
    return { data: null, error: apiError };
  }
} 