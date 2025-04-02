import { useNavigate, useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface RouteError {
  statusText?: string;
  message?: string;
  status?: number;
}

export function ErrorPage() {
  const error = useRouteError() as RouteError;
  const navigate = useNavigate();

  const errorMessage = error?.message || error?.statusText || 'An unexpected error occurred';
  const errorStatus = error?.status || '500';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{errorStatus}</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Something went wrong</p>
        <p className="text-gray-500 mb-8">{errorMessage}</p>
        
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/')}
            className="w-full"
            variant="default"
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => navigate(-1)}
            className="w-full"
            variant="outline"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
} 