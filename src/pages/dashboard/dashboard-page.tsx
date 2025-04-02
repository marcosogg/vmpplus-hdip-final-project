import { PageHeader } from '@/components/layout/page-header';
import { LogoutButton } from '@/components/auth/logout-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome to VMP PLUS"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Welcome to your Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            This is a placeholder dashboard page. You are now logged in.
          </p>
          <LogoutButton />
        </CardContent>
      </Card>
    </div>
  );
} 