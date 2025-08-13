import React, { useState } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { SignOutButton } from '@clerk/clerk-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  CreditCard, 
  Brain, 
  FileText,
  Menu,
  X,
  LogOut,
  User,
  Bell
} from 'lucide-react';

const navigation = [
  {
    name: 'Executive Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'accountant', 'viewer']
  },
  {
    name: 'Budget Analytics',
    href: '/dashboard/budget-analytics',
    icon: TrendingUp,
    roles: ['admin', 'accountant', 'viewer']
  },
  {
    name: 'Cash Flow Monitor',
    href: '/dashboard/cash-flow',
    icon: CreditCard,
    roles: ['admin', 'accountant', 'viewer']
  },
  {
    name: 'AI Insights',
    href: '/dashboard/ai-insights',
    icon: Brain,
    roles: ['admin', 'accountant', 'viewer']
  },
  {
    name: 'GST & Tax Analytics',
    href: '/dashboard/tax-analytics',
    icon: FileText,
    roles: ['admin', 'accountant']
  }
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, userProfile } = useAuthContext();

  const filteredNavigation = navigation?.filter(item => 
    item?.roles?.includes(userProfile?.role || 'viewer')
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FinanceTracker</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.fullName || userProfile?.full_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {userProfile?.role || 'Viewer'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {filteredNavigation?.map((item) => {
              const isActive = location?.pathname === item?.href;
              return (
                <NavLink
                  key={item?.name}
                  to={item?.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' :'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon className={`
                    flex-shrink-0 w-5 h-5 mr-3
                    ${isActive ? 'text-blue-600' : 'text-gray-400'}
                  `} />
                  {item?.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Sign out */}
          <div className="px-4 py-4 border-t border-gray-200">
            <SignOutButton>
              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200">
                <LogOut className="flex-shrink-0 w-5 h-5 mr-3 text-gray-400" />
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {new Date()?.toLocaleDateString('en-IN', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}