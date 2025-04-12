import { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useUserProfile } from '@/hooks/use-user-profile';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const { isProfileLoading } = useUserProfile();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // If user is authenticated but profile is still loading, we should still show the layout
  // Only consider auth loading for redirects, profile loading shouldn't trigger redirects
  const isAuthenticationReady = !isAuthLoading;
  
  // For UI purposes, we're loading if either auth or profile is loading
  const isFullyLoaded = !isAuthLoading && !(isAuthenticated && isProfileLoading);

  useEffect(() => {
    // If authentication check is finished and user is NOT authenticated, set redirect flag
    if (isAuthenticationReady && !isAuthenticated) {
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
  }, [isAuthenticationReady, isAuthenticated]);

  // Show loading state only during initial auth loading
  // We'll let profile loading happen with the UI visible
  if (isAuthLoading) {
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
  // We don't return null anymore, as we want to show the UI even if profile is still loading
  return isAuthenticated ? <>{children}</> : null;
} 