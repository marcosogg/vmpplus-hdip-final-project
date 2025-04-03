import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Navigation items configuration
const navItems = [
  {
    title: 'Dashboard',
    href: '/app/dashboard',
  },
  {
    title: 'Vendors',
    href: '/app/vendors',
  },
  {
    title: 'Contracts',
    href: '/app/contracts',
  },
] as const;

export function SidebarNav() {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
              'hover:bg-gray-100',
              isActive 
                ? 'bg-gray-100 text-blue-600 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            )
          }
        >
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
} 