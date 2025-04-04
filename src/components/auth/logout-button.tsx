import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
    >
      Logout
    </Button>
  );
} 