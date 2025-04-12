import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from '@/components/auth/logout-button';
import { useUserProfile } from '@/hooks/use-user-profile';

const Header: React.FC = () => {
  const { profile, userRole, isProfileLoading } = useUserProfile();
  
  // Get initials for avatar fallback
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section: Breadcrumbs Placeholder */}
          <div className="flex items-center">
            <span className="text-lg font-semibold text-gray-700">Dashboard</span>
            {/* Add Breadcrumb components here later if needed */}
          </div>

          {/* Right Section: Actions, Search, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            {/* Action Buttons Placeholder */}
            <div className="hidden md:flex items-center space-x-2">
              <button className="text-sm font-medium text-gray-600 hover:text-gray-900">App</button>
              <button className="text-sm font-medium text-gray-600 hover:text-gray-900">Files</button>
            </div>

            {/* Search Icon Placeholder */}
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">Search</span>
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Notifications Icon Placeholder */}
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" aria-hidden="true" />
              {/* Notification indicator can be added here */}
            </button>

            {/* Separator */}
            <div className="hidden md:block h-6 w-px bg-gray-200" aria-hidden="true" />

            {/* User Profile with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 pl-2 pr-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{!isProfileLoading && profile ? getInitials(profile.full_name) : 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-700">
                      {!isProfileLoading && profile ? profile.full_name || profile.email : 'Loading...'}
                    </span>
                    {!isProfileLoading && userRole && (
                      <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                        {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                      </Badge>
                    )}
                    {isProfileLoading && (
                      <Badge variant="outline" className="text-xs px-1 py-0 h-4 animate-pulse">
                        Loading...
                      </Badge>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <NavLink to="/app/profile" className="w-full justify-start cursor-pointer">
                    Profile
                  </NavLink>
                </DropdownMenuItem>
                {userRole === 'admin' && (
                  <DropdownMenuItem asChild>
                    <NavLink to="/app/settings" className="w-full justify-start cursor-pointer">
                      Settings
                    </NavLink>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <LogoutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 