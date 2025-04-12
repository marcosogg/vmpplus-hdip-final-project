import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, FileText, File, Settings, Menu } from 'lucide-react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Define a type for user roles
type UserRole = 'admin' | 'buyer' | string;

// Navigation items configuration
const navItems = [
  {
    title: 'Dashboard',
    href: '/app/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['admin', 'buyer'] as UserRole[], // All roles can access dashboard
  },
  {
    title: 'Vendors',
    href: '/app/vendors',
    icon: Users,
    allowedRoles: ['admin', 'buyer'] as UserRole[], // All roles can access vendors
  },
  {
    title: 'Contracts',
    href: '/app/contracts',
    icon: FileText,
    allowedRoles: ['admin', 'buyer'] as UserRole[], // All roles can access contracts
  },
  {
    title: 'Documents',
    href: '/app/documents',
    icon: File,
    allowedRoles: ['admin', 'buyer'] as UserRole[], // All roles can access documents
  },
  {
    title: 'Settings',
    href: '/app/settings',
    icon: Settings,
    allowedRoles: ['admin'] as UserRole[], // Only admin can access settings
  },
];

export function SidebarNav() {
  const { userRole, isProfileLoading, profile } = useUserProfile();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Filter navigation items based on user role
  const visibleNavItems = navItems.filter(item => {
    // If still loading or no role assigned, show only common items accessible to all roles
    if (isProfileLoading || !userRole) {
      // Show items that all roles can access while loading (excludes admin-only items)
      return item.allowedRoles.includes('buyer');  // Show items that buyers can see (all basic items)
    }
    
    // When role is determined, show the appropriate items for that role
    return item.allowedRoles.includes(userRole);
  });
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }
    return profile?.email ? profile.email[0].toUpperCase() : 'CM';
  };
  
  // Get avatar URL
  const getAvatarUrl = () => {
    if (profile?.avatar_url) {
      return profile.avatar_url;
    }
    return 'https://xsgames.co/randomusers/avatar.php?g=male';
  };
  
  return (
    <div className={`h-screen flex flex-col bg-navy-900 ${isSidebarCollapsed ? 'w-16' : 'w-72'}`}>
      {/* Logo and title header */}
      <div className="p-4 flex items-center justify-end border-b border-navy-800/30">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="text-navy-50 hover:bg-navy-800/50"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-md text-sm font-medium transition-colors w-full',
                  isSidebarCollapsed ? 'justify-center py-3 px-2' : 'py-2.5 px-3.5',
                  'hover:bg-navy-800/50',
                  isActive 
                    ? 'text-white font-semibold bg-navy-800 hover:bg-navy-700'
                    : 'text-navy-100'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn(
                    "h-5 w-5 min-w-5 min-h-5",
                    !isSidebarCollapsed && "mr-2",
                    isActive ? "text-white" : "text-navy-100"
                  )} />
                  {!isSidebarCollapsed && <span>{item.title}</span>}
                </>
              )}
            </NavLink>
          ))}
      
          <Separator className="my-4 bg-navy-800/30" />
        </div>
      </nav>
      
      {/* User profile at bottom - fixed position to ensure visibility */}
      <div className="p-4 border-t border-navy-800/30 sticky bottom-0 bg-navy-900">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src={getAvatarUrl()} alt={profile?.full_name || 'User'} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          {!isSidebarCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-navy-50">{profile?.full_name || 'Chris Miller'}</p>
              <p className="text-xs text-navy-200">{userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'Admin'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 