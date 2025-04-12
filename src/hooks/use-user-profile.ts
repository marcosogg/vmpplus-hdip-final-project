import { useContext } from 'react';
import { UserProfileContext } from '@/context/user-profile-context';
import { UserProfileContextType } from '@/types/user-profile';

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  
  return context;
}; 