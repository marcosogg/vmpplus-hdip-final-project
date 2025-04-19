import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureCard } from "@/components/landing/feature-card";
import { 
  BarChart3, 
  ClipboardCheck, 
  Clock, 
  FileText, 
  Gauge, 
  LineChart, 
  Lock, 
  SearchCheck, 
  Shield 
} from "lucide-react";
import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple header for landing page */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/images/vmp-logo-master.png" alt="VMP Plus Logo" className="h-10" />
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#benefits" className="text-slate-600 hover:text-blue-600 transition-colors">Benefits</a>
            <a href="#pricing" className="text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#faq" className="text-slate-600 hover:text-blue-600 transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild className="hidden sm:inline-flex">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Powerful Features for Complete Vendor Management
              </h2>
              <p className="text-xl text-slate-600">
                VMP Plus provides all the tools you need to manage your vendor relationships efficiently from onboarding to performance analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={ClipboardCheck} 
                title="Vendor Onboarding" 
                description="Streamline the vendor onboarding process with customizable forms, document collection, and approval workflows."
              />
              <FeatureCard 
                icon={FileText} 
                title="Contract Management" 
                description="Centralize all vendor contracts with automated renewal reminders, version tracking, and approval routing."
              />
              <FeatureCard 
                icon={Shield} 
                title="Risk Assessment" 
                description="Evaluate vendor risks with customizable assessment templates and automated scoring."
              />
              <FeatureCard 
                icon={BarChart3} 
                title="Performance Tracking" 
                description="Monitor vendor performance with KPIs, scorecards, and real-time dashboards."
              />
              <FeatureCard 
                icon={SearchCheck} 
                title="Compliance Monitoring" 
                description="Ensure vendors meet regulatory requirements with automated compliance checks and documentation."
              />
              <FeatureCard 
                icon={Clock} 
                title="Automated Workflows" 
                description="Reduce manual work with automated approval processes, notifications, and task assignments."
              />
            </div>
          </div>
        </section>

        {/* Benefits Section with Stats */}
        <section id="benefits" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Transform Your Vendor Management
              </h2>
              <p className="text-xl text-slate-600">
                Join hundreds of organizations that have optimized their vendor relationships and processes with VMP Plus.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div className="text-center p-6 rounded-lg bg-blue-50">
                <div className="text-4xl font-bold text-blue-600 mb-2">85%</div>
                <p className="text-slate-700">Reduction in vendor onboarding time</p>
              </div>
              <div className="text-center p-6 rounded-lg bg-blue-50">
                <div className="text-4xl font-bold text-blue-600 mb-2">$1.2M</div>
                <p className="text-slate-700">Average annual savings</p>
              </div>
              <div className="text-center p-6 rounded-lg bg-blue-50">
                <div className="text-4xl font-bold text-blue-600 mb-2">64%</div>
                <p className="text-slate-700">Decrease in compliance issues</p>
              </div>
              <div className="text-center p-6 rounded-lg bg-blue-50">
                <div className="text-4xl font-bold text-blue-600 mb-2">42%</div>
                <p className="text-slate-700">Improvement in vendor performance</p>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Gauge className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Operational Efficiency</h3>
                  <p className="text-slate-600">
                    Reduce administrative overhead by automating routine tasks, centralizing information, and standardizing processes across your organization.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <LineChart className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Strategic Insights</h3>
                  <p className="text-slate-600">
                    Make data-driven decisions with comprehensive analytics, performance tracking, and custom reporting capabilities.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Lock className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Risk Mitigation</h3>
                  <p className="text-slate-600">
                    Identify and address potential vendor risks before they impact your business with proactive monitoring and assessment tools.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Cost Optimization</h3>
                  <p className="text-slate-600">
                    Identify cost-saving opportunities, eliminate duplicate vendors, and negotiate better terms with comprehensive spend analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trusted by Industry Leaders
              </h2>
              <p className="text-xl text-blue-100">
                See what our customers are saying about VMP Plus
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="text-yellow-400 flex mb-4">
                  ★ ★ ★ ★ ★
                </div>
                <p className="italic text-blue-50 mb-6">
                  "VMP Plus has transformed how we manage our vendor relationships. The centralized platform and automated workflows have saved us countless hours."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                    JD
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">Jane Doe</div>
                    <div className="text-xs text-blue-200">Procurement Director, Enterprise Co.</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="text-yellow-400 flex mb-4">
                  ★ ★ ★ ★ ★
                </div>
                <p className="italic text-blue-50 mb-6">
                  "The analytics and reporting capabilities are incredible. We now have real-time insights into vendor performance and can make data-driven decisions."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                    JS
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">John Smith</div>
                    <div className="text-xs text-blue-200">CFO, Growth Industries</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="text-yellow-400 flex mb-4">
                  ★ ★ ★ ★ ★
                </div>
                <p className="italic text-blue-50 mb-6">
                  "The risk assessment tools have been a game-changer for our compliance team. We've identified and mitigated issues that would have gone unnoticed."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                    AS
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">Amanda Sykes</div>
                    <div className="text-xs text-blue-200">Compliance Officer, SecureTech</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-slate-600">
                Choose the plan that's right for your organization
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Starter Plan */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Starter</h3>
                  <p className="text-slate-600 mb-4">For small businesses</p>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold text-slate-900">$99</span>
                    <span className="text-slate-600 ml-2">/month</span>
                  </div>
                  <Button size="lg" variant="outline" className="w-full" asChild>
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Up to 50 vendors</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Basic reporting</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Document storage (5GB)</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Email support</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Professional Plan */}
              <div className="bg-white rounded-lg shadow-xl overflow-hidden border-2 border-blue-600 transform scale-105 z-10">
                <div className="p-6 bg-blue-600 text-white">
                  <h3 className="text-xl font-bold mb-1">Professional</h3>
                  <p className="text-blue-100 mb-4">For growing businesses</p>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold">$249</span>
                    <span className="text-blue-100 ml-2">/month</span>
                  </div>
                  <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-blue-50" asChild>
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Unlimited vendors</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Document storage (25GB)</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Custom workflows</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Enterprise</h3>
                  <p className="text-slate-600 mb-4">For large organizations</p>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold text-slate-900">Custom</span>
                  </div>
                  <Button size="lg" variant="outline" className="w-full" asChild>
                    <Link to="/contact">Contact Sales</Link>
                  </Button>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Unlimited everything</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Advanced security features</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Custom integrations</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Dedicated account manager</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>24/7 premium support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-slate-600">
                Find answers to common questions about VMP Plus
              </p>
            </div>

            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
              <div className="py-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">How long does it take to implement VMP Plus?</h3>
                <p className="text-slate-600">Most customers are up and running within 2-4 weeks, depending on the complexity of their vendor ecosystem and integration requirements.</p>
              </div>
              <div className="py-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Can I import my existing vendor data?</h3>
                <p className="text-slate-600">Yes, VMP Plus provides tools to import existing vendor data from spreadsheets or other systems. Our team can also assist with data migration for enterprise customers.</p>
              </div>
              <div className="py-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Is VMP Plus compliant with industry regulations?</h3>
                <p className="text-slate-600">VMP Plus is designed with compliance in mind and supports GDPR, CCPA, ISO 27001, and other common regulatory frameworks. Our enterprise plans include additional compliance features.</p>
              </div>
              <div className="py-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Does VMP Plus integrate with other systems?</h3>
                <p className="text-slate-600">Yes, VMP Plus offers integrations with popular ERP systems, CRMs, accounting software, and more. Custom integrations are available for enterprise plans.</p>
              </div>
              <div className="py-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">What kind of support do you offer?</h3>
                <p className="text-slate-600">All plans include email support with varying response times. Professional and Enterprise plans include priority support, and Enterprise plans also offer 24/7 support and a dedicated account manager.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to transform your vendor management?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of organizations already using VMP Plus to streamline their vendor processes and drive better results.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
                <Link to="/signup">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                <Link to="/request-demo">Request Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/images/vmp-logo-whitebg.png" alt="VMP Plus Logo" className="h-10 mb-4" />
              <p className="text-slate-400">
                The complete vendor management platform for modern businesses.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Customers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Legal</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} VMP Plus. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 