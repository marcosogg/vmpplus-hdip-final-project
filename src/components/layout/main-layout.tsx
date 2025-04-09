import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarNav } from './sidebar-nav';
import { Toaster } from '@/components/ui/toaster';
import { LogoutButton } from '@/components/auth/logout-button';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, ChevronDown, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  
  // Determine page title based on the current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Vendor Management Dashboard';
    if (path.includes('/vendors')) return 'Vendor Management';
    if (path.includes('/contracts')) return 'Contract Management';
    if (path.includes('/documents')) return 'Document Management';
    return 'VMP PLUS';
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-white flex flex-col">
        {/* Logo area */}
        <div className="p-4 border-b border-sidebar-800">
          <span className="font-bold text-xl">VendorHub</span>
        </div>
        {/* Nav items */}
        <nav className="flex-1 p-4">
          <SidebarNav />
        </nav>
        {/* Footer area if needed */}
        <div className="p-4 text-xs text-sidebar-200 border-t border-sidebar-700">
          <div>Made with 💜 Remix</div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-contentBackground">
        {/* Header */}
        <header className="bg-white p-4 shadow-sm">
          <div className="flex justify-between items-center">
            {/* Page title */}
            <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
            
            {/* Right side with user info and notifications */}
            <div className="flex items-center space-x-4">
              {/* Notification bell */}
              <div className="relative">
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 justify-center rounded-full p-0 text-xs" variant="destructive">3</Badge>
                </Button>
              </div>
              
              {/* Settings button */}
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
              
              {/* User profile with dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 pl-2 pr-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Sarah Johnson</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Account Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <LogoutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
} 