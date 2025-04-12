import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarNav } from './sidebar-nav';
import { Toaster } from '@/components/ui/toaster';
import { LogoutButton } from '@/components/auth/logout-button';
import Header from './Header';
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
  
  return (
    <div className="h-screen flex">
      {/* Sidebar - removing fixed width since it's now controlled in SidebarNav */}
      <aside className="bg-navy-900 text-white flex flex-col">
        <SidebarNav />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto">
        <Header />

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
} 