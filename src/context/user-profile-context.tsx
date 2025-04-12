import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getCurrentProfile } from '@/lib/api/profiles';
import { Profile } from '@/lib/api/profiles';
import { UserProfileContextType, UserProfileState } from '@/types/user-profile';
import { supabase } from '@/lib/supabase';

// Initial state for user profile
const initialState: UserProfileState = {
  profile: null,
  userRole: null,
  isProfileLoading: true,
  error: null
};

// Create the context
export const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

// Provider props type
interface UserProfileProviderProps {
  children: ReactNode;
}

// Profile data with role name
interface ProfileWithRole extends Profile {
  roles?: {
    name: string;
  } | null;
}

export function UserProfileProvider({ children }: UserProfileProviderProps) {
  const [state, setState] = useState<UserProfileState>(initialState);
  const { user, isAuthenticated, isLoading } = useAuth();

  // Fetch profile and role data
  const fetchProfileWithRole = async () => {
    if (!user) {
      console.log('UserProfileContext: No user, resetting profile state');
      setState({
        profile: null,
        userRole: null,
        isProfileLoading: false,
        error: null
      });
      return;
    }

    console.log('UserProfileContext: Fetching profile for user', user.id);
    setState(prev => ({ ...prev, isProfileLoading: true }));

    try {
      // Get profile with role data using a join
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          roles:role_id (
            name
          )
        `)
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('UserProfileContext: Error fetching profile:', error);
        throw error;
      }

      const profileWithRole = data as ProfileWithRole;
      
      console.log('UserProfileContext: Profile loaded successfully', {
        userId: user.id,
        email: profileWithRole.email,
        role: profileWithRole.roles?.name || 'no role assigned'
      });
      
      // Even if roles is null, we should still set the profile data
      setState({
        profile: profileWithRole,
        userRole: profileWithRole.roles?.name || null,
        isProfileLoading: false,
        error: null
      });
    } catch (error) {
      console.error('UserProfileContext: Error fetching profile:', error);
      setState({
        profile: null,
        userRole: null,
        isProfileLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load profile'
      });
    }
  };

  // When auth state changes, fetch profile
  useEffect(() => {
    console.log('UserProfileContext: Auth state changed', { 
      isAuthenticated, 
      isLoading,
      userId: user?.id 
    });
    
    if (!isLoading && isAuthenticated) {
      fetchProfileWithRole();
    } else if (!isLoading && !isAuthenticated) {
      // Reset the state when not authenticated
      setState({
        profile: null,
        userRole: null,
        isProfileLoading: false,
        error: null
      });
    }
  }, [isAuthenticated, isLoading, user?.id]);

  // Public method to refresh profile data
  const refreshProfile = async () => {
    await fetchProfileWithRole();
  };

  const value = {
    ...state,
    refreshProfile
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
} 