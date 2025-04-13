import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from '@/components/auth/logout-button';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useAuth } from '@/hooks/use-auth';
import { Input } from "@/components/ui/input";

const Header: React.FC = () => {
  const { profile, userRole, isProfileLoading } = useUserProfile();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get initials for avatar fallback
  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }
    return email[0].toUpperCase();
  };
  
  const getAvatarUrl = () => {
    if (profile?.avatar_url) {
      return profile.avatar_url;
    }
    // Default to male avatars for simplicity since we don't store gender in profile
    return 'https://xsgames.co/randomusers/avatar.php?g=male';
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent any default form submission
      const trimmedSearchTerm = searchTerm.trim();
      if (trimmedSearchTerm) {
        // Navigate to vendor list with search query parameter
        navigate(`/app/vendors?search=${encodeURIComponent(trimmedSearchTerm)}`);
      } else {
        // Navigate to the plain vendor list if search is empty
        navigate('/app/vendors');
      }
    }
  };
  
  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="flex items-center justify-between px-16 py-4">
        <div className="flex items-center">
          <img src="/images/vmp-logo-master.png" alt="VMP PLUS" className="h-8 w-auto" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search vendors..."
              className="w-64 pl-8 rounded-md border border-gray-300 dark:border-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={getAvatarUrl()} 
                    alt={profile?.full_name || 'User'}
                  />
                  <AvatarFallback>{profile ? getInitials(profile.full_name, profile.email) : 'CM'}</AvatarFallback>
                </Avatar>
                <span>{profile?.full_name || 'Chris Miller'}</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/app/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/app/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header; 