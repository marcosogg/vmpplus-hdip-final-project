import { AppRouter } from './router';
import { AuthProvider } from './context/auth-context';
import { UserProfileProvider } from './context/user-profile-context';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <UserProfileProvider>
        <AppRouter />
        <Toaster />
      </UserProfileProvider>
    </AuthProvider>
  );
}

export default App;
