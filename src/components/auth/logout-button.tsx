import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <DropdownMenuItem 
      onClick={handleLogout} 
      className="text-red-500 hover:text-red-600 focus:text-red-600 cursor-pointer"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Logout</span>
    </DropdownMenuItem>
  );
} 