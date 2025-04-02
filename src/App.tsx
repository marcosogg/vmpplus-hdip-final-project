import { AppRouter } from './router';
import { Button } from '@/components/ui/button';

function App() {
  return (
    <>
      <div className="p-4">
        <Button>Test Button</Button>
      </div>
      <AppRouter />
    </>
  );
}

export default App;
