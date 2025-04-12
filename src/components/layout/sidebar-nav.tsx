import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, FileText, File, Settings } from 'lucide-react';
import { useUserProfile } from '@/hooks/use-user-profile';

// Navigation items configuration
const navItems = [
  {
    title: 'Dashboard',
    href: '/app/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['admin', 'buyer'], // All roles can access dashboard
  },
  {
    title: 'Vendors',
    href: '/app/vendors',
    icon: Users,
    allowedRoles: ['admin', 'buyer'], // All roles can access vendors
  },
  {
    title: 'Contracts',
    href: '/app/contracts',
    icon: FileText,
    allowedRoles: ['admin', 'buyer'], // All roles can access contracts
  },
  {
    title: 'Documents',
    href: '/app/documents',
    icon: File,
    allowedRoles: ['admin', 'buyer'], // All roles can access documents
  },
  {
    title: 'Settings',
    href: '/app/settings',
    icon: Settings,
    allowedRoles: ['admin'], // Only admin can access settings
  },
] as const;

export function SidebarNav() {
  const { userRole, isProfileLoading } = useUserProfile();
  
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
  
  return (
    <div className="space-y-1">
      {visibleNavItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              'flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors',
              'hover:bg-slate-700 hover:text-white',
              isActive 
                ? 'bg-purple-600 text-white'
                : 'text-gray-300'
            )
          }
        >
          <item.icon className={cn(
            "mr-3 h-5 w-5",
          )} />
          <span>{item.title}</span>
        </NavLink>
      ))}
    </div>
  );
} 