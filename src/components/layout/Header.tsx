import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, Bell, ChevronDown } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { getVendors } from '@/lib/api/vendors';

const Header: React.FC = () => {
  const { profile, userRole, isProfileLoading } = useUserProfile();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  // State for vendor search
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);
  };
  
  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to dashboard with search term
      navigate(`/app/dashboard?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  
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
  
  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="flex items-center justify-between px-16 py-4">
        <div className="flex items-center">
          <img src="/images/vmp-logo-master.png" alt="VMP PLUS" className="h-8 w-auto" />
        </div>
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search vendors..."
              className="w-64 pl-8 rounded-md border border-gray-300 dark:border-gray-600"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </form>
          <Button variant="ghost" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              3
            </span>
          </Button>
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