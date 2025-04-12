import { Profile } from '@/lib/api/profiles';

export interface UserProfileState {
  profile: Profile | null;
  userRole: string | null;
  isProfileLoading: boolean;
  error: string | null;
}

export interface UserProfileContextType extends UserProfileState {
  refreshProfile: () => Promise<void>;
} 