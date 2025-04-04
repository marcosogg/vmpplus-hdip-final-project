import { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // If loading is finished and user is NOT authenticated, set redirect flag
    if (!isLoading && !isAuthenticated) {
      // Introduce a small delay to allow other navigation (like from LogoutButton) to potentially occur first
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 50); // 50ms delay

      // Cleanup timer if component unmounts or auth state changes before timeout
      return () => clearTimeout(timer);
    } else {
      // Reset redirect flag if authenticated or still loading
      setShouldRedirect(false);
    }
  }, [isLoading, isAuthenticated]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-8 text-center flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if flag is set
  if (shouldRedirect) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated (and redirect flag is not set)
  return isAuthenticated ? <>{children}</> : null; // Return null if not authenticated but not redirecting yet
} 