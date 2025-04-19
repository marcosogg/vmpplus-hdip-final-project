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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
              Simplify Your <span className="text-blue-600">Vendor Management</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl">
              VMP Plus helps you streamline vendor relationships, mitigate risks, and drive more value from your vendor ecosystem with our all-in-one platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="font-medium">
                <Link to="/signup">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="font-medium bg-white text-blue-600 border-blue-600 hover:bg-blue-50">
                <Link to="/request-demo">Request Demo</Link>
              </Button>
            </div>
          </div>
          
          {/* Right column - Image/Illustration */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              {/* Background blobs with updated colors and positions */}
              {/* Primary blob */}
              <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              {/* Secondary blob */}
              <div className="absolute -top-4 right-0 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              {/* Accent blob */}
              <div className="absolute -bottom-10 left-24 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              
              {/* Dashboard mockup */}
              <div className="relative">
                <div className="relative rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                  {/* Professional image showcase */}
                  <div className="bg-white aspect-[16/10] flex items-center justify-center">
                    <img 
                      src="/two-professionals.png" 
                      alt="Professionals using VMP Plus" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to VMP Plus logo if image doesn't exist
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/vmp-logo-master.png';
                        target.className = 'w-64 h-auto mx-auto'; // Center the logo and give it a reasonable size
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