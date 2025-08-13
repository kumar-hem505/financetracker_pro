import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toast';

// Pages
import NotFound from './pages/NotFound';
import DashboardLayout from './components/dashboard/DashboardLayout';
import ExecutiveDashboard from './pages/dashboard/ExecutiveDashboard';
import AIInsightsDashboard from './pages/dashboard/AIInsightsDashboard';

// Landing Page Component
function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FinanceTracker Pro</h1>
          <p className="text-gray-600">
            AI-powered company finance tracking with real-time insights
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">🚀 Key Features:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Real-time financial tracking in INR (₹)</li>
              <li>• AI-powered insights with Gemini API</li>
              <li>• Multi-role access (Admin/Accountant/Viewer)</li>
              <li>• GST & Tax compliance analytics</li>
              <li>• Interactive charts and forecasting</li>
              <li>• Secure document storage</li>
            </ul>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Please sign in to access your financial dashboard
            </p>
            <button 
              onClick={() => window.location.href = '/sign-in'}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Get Started →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Auth Pages Layout
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

function Routes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>
            <ScrollToTop />
            <RouterRoutes>
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <SignedOut>
                    <LandingPage />
                  </SignedOut>
                  <SignedIn>
                    <Navigate to="/dashboard" replace />
                  </SignedIn>
                </>
              } />
              
              {/* Auth Routes */}
              <Route path="/sign-in/*" element={
                <SignedOut>
                  <AuthLayout>
                    <SignIn 
                      routing="path"
                      path="/sign-in"
                      afterSignInUrl="/dashboard"
                      signUpUrl="/sign-up"
                    />
                  </AuthLayout>
                </SignedOut>
              } />
              
              <Route path="/sign-up/*" element={
                <SignedOut>
                  <AuthLayout>
                    <SignUp 
                      routing="path"
                      path="/sign-up"
                      afterSignUpUrl="/dashboard"
                      signInUrl="/sign-in"
                    />
                  </AuthLayout>
                </SignedOut>
              } />
              
              {/* Protected Dashboard Routes */}
              <Route path="/dashboard" element={
                <SignedIn>
                  <DashboardLayout />
                </SignedIn>
              }>
                <Route index element={<ExecutiveDashboard />} />
                <Route path="budget-analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">Budget Performance Analytics</h1><p className="text-gray-600 mt-2">Budget analytics dashboard coming soon...</p></div>} />
                <Route path="cash-flow" element={<div className="p-6"><h1 className="text-2xl font-bold">Real-time Cash Flow Monitor</h1><p className="text-gray-600 mt-2">Cash flow monitoring dashboard coming soon...</p></div>} />
                <Route path="ai-insights" element={<AIInsightsDashboard />} />
                <Route path="tax-analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">GST & Tax Analytics</h1><p className="text-gray-600 mt-2">Tax analytics dashboard coming soon...</p></div>} />
              </Route>
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </RouterRoutes>
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default Routes;