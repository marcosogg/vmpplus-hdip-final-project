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

const Header: React.FC = () => {
  const { profile, userRole, isProfileLoading } = useUserProfile();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">
              VMP PLUS
            </span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="outline" className="relative h-8 w-full justify-start text-sm font-normal md:w-40 lg:w-64">
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline-flex">Search...</span>
            </Button>
          </div>

          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500" />
            </Button>

            {!isProfileLoading && profile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={getAvatarUrl()} 
                        alt={profile.full_name || profile.email}
                      />
                      <AvatarFallback>{getInitials(profile.full_name, profile.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile.full_name || 'No name set'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {profile.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/app/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/app/settings')}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 