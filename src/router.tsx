import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { MainLayout } from './components/layout/main-layout';

// Auth pages
import { LoginPage } from './pages/auth/login-page';
import { SignupPage } from './pages/auth/signup-page';

// Landing page
import { LandingPage } from './pages/landing/landing-page';

// Protected pages
import { DashboardPage } from './pages/dashboard/dashboard-page';
import { VendorListPage } from './pages/vendor/vendor-list';
import { VendorDetailPage } from './pages/vendor/vendor-detail';
import { VendorCreatePage } from './pages/vendor/vendor-create';
import { VendorEditPage } from './pages/vendor/vendor-edit';
import { ContractListPage } from './pages/contract/contract-list';
import { ContractDetailPage } from './pages/contract/contract-detail';
import { ContractCreatePage } from './pages/contract/contract-create';
import { ContractEditPage } from './pages/contract/contract-edit';
import { DocumentListPage } from './pages/document/document-list';
import { DocumentDetailPage } from './pages/document/document-detail';
import SettingsPage from './pages/settings/settings-page';
import ProfilePage from './pages/profile/profile-page';

// Not found page
const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-lg text-gray-600">Page not found</p>
    </div>
  </div>
);

export function AppRouter() {
  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Public auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Protected routes with MainLayout */}
      <Route 
        path="/app" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Outlet />
            </MainLayout>
          </ProtectedRoute>
        }
      >
        {/* Redirect app root to dashboard */}
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        
        {/* Dashboard */}
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* Vendor routes */}
        <Route path="vendors" element={<VendorListPage />} />
        <Route path="vendors/new" element={<VendorCreatePage />} />
        <Route path="vendors/:id" element={<VendorDetailPage />} />
        <Route path="vendors/:id/edit" element={<VendorEditPage />} />
        
        {/* Contract routes */}
        <Route path="contracts" element={<ContractListPage />} />
        <Route path="contracts/new" element={<ContractCreatePage />} />
        <Route path="contracts/:id" element={<ContractDetailPage />} />
        <Route path="contracts/:id/edit" element={<ContractEditPage />} />
        
        {/* Document routes */}
        <Route path="documents" element={<DocumentListPage />} />
        <Route path="documents/:id" element={<DocumentDetailPage />} />

        {/* Settings route */}
        <Route path="settings" element={<SettingsPage />} />

        {/* Profile route */}
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      
      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
} 