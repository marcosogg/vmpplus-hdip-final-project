import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, Bell, ChevronDown } from 'lucide-react'; // Added ChevronDown
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from '@/components/auth/logout-button';

const Header: React.FC = () => {
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
                    <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium text-gray-700">Sarah Johnson</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <NavLink to="/app/profile" className="w-full justify-start cursor-pointer">
                    Profile
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem>Account Settings</DropdownMenuItem>
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