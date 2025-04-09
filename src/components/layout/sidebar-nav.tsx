import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, FileText, File, Settings } from 'lucide-react';

// Navigation items configuration
const navItems = [
  {
    title: 'Dashboard',
    href: '/app/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Vendors',
    href: '/app/vendors',
    icon: Users,
  },
  {
    title: 'Contracts',
    href: '/app/contracts',
    icon: FileText,
  },
  {
    title: 'Documents',
    href: '/app/documents',
    icon: File,
  },
  {
    title: 'Settings',
    href: '/app/settings',
    icon: Settings,
  },
] as const;

export function SidebarNav() {
  return (
    <div className="space-y-6">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              'flex items-center py-2 px-3 rounded-md text-sm transition-colors',
              'hover:bg-white/10',
              isActive 
                ? 'bg-white/10 text-white font-medium'
                : 'text-white/70 hover:text-white'
            )
          }
        >
          <item.icon className="mr-3 h-5 w-5" />
          <span>{item.title}</span>
        </NavLink>
      ))}
    </div>
  );
} 