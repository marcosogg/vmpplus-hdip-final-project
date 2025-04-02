import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white pointer-events-none" aria-hidden="true" />
      
      <div className="relative container mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column - Text content */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center px-3 py-1.5 mb-6 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
              <span className="mr-2">New</span>
              <span className="font-semibold">Vendor Risk Assessment</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
              Simplify Your <span className="text-blue-600">Vendor Management</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl">
              VMP Plus helps you streamline vendor relationships, mitigate risks, and drive more value from your vendor ecosystem with our all-in-one platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="font-medium">
                <Link to="/signup">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="font-medium">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
            
            {/* Key benefits */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BarChart2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-900">Performance Tracking</h3>
                  <p className="mt-1 text-sm text-slate-500">Monitor vendor performance with real-time analytics</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-900">Risk Management</h3>
                  <p className="mt-1 text-sm text-slate-500">Identify and mitigate vendor-related risks</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-900">Centralized Management</h3>
                  <p className="mt-1 text-sm text-slate-500">All vendor data in one secure location</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-900">Efficient Workflows</h3>
                  <p className="mt-1 text-sm text-slate-500">Automate approvals and contract renewals</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Image/Illustration */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              {/* Purple blob */}
              <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              {/* Yellow blob */}
              <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              {/* Pink blob */}
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              
              {/* Dashboard mockup */}
              <div className="relative">
                <div className="relative rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                  {/* Placeholder for dashboard image - in a real implementation, use an actual image */}
                  <div className="bg-white aspect-[16/10] flex items-center justify-center">
                    <img 
                      src="/dashboard-mockup.png" 
                      alt="VMP Plus Dashboard" 
                      className="w-full h-auto"
                      onError={(e) => {
                        // Fallback if image doesn't exist
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22500%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20500%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15e37bc6ad6%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15e37bc6ad6%22%3E%3Crect%20width%3D%22800%22%20height%3D%22500%22%20fill%3D%22%23F8F9FA%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285%22%20y%3D%22270%22%3EVMP%20Plus%20Dashboard%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 