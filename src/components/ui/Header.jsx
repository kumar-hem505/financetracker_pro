import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const location = useLocation();

  const primaryNavItems = [
    {
      label: 'Dashboard',
      path: '/executive-financial-overview-dashboard',
      icon: 'LayoutDashboard'
    },
    {
      label: 'Cash Flow',
      path: '/real-time-cash-flow-monitoring-dashboard',
      icon: 'TrendingUp'
    },
    {
      label: 'Budget Analytics',
      path: '/budget-performance-analytics-dashboard',
      icon: 'BarChart3'
    },
    {
      label: 'Tax Compliance',
      path: '/gst-compliance-tax-analytics-dashboard',
      icon: 'FileText'
    }
  ];

  const secondaryNavItems = [
    {
      label: 'AI Insights',
      path: '/ai-powered-financial-insights-dashboard',
      icon: 'Brain'
    }
  ];

  const isActivePath = (path) => location?.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-card border-b border-border financial-shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/executive-financial-overview-dashboard" className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="DollarSign" size={20} color="white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground font-sans">FinanceTracker</span>
            <span className="text-xs text-muted-foreground font-medium">Pro</span>
          </div>
        </Link>

        {/* Primary Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium financial-transition ${
                isActivePath(item?.path)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </Link>
          ))}
        </nav>

        {/* Secondary Actions */}
        <div className="flex items-center space-x-2">
          {/* AI Insights - Desktop */}
          <Link
            to="/ai-powered-financial-insights-dashboard"
            className={`hidden lg:flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium financial-transition ${
              isActivePath('/ai-powered-financial-insights-dashboard')
                ? 'bg-accent text-accent-foreground' :'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon name="Brain" size={16} />
            <span>AI Insights</span>
          </Link>

          {/* More Menu - Mobile */}
          <div className="relative lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              iconName="Menu"
              iconSize={20}
            >
              Menu
            </Button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg financial-shadow-md z-200">
                <div className="py-2">
                  {[...primaryNavItems, ...secondaryNavItems]?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      onClick={() => setIsMoreMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium financial-transition ${
                        isActivePath(item?.path)
                          ? 'bg-accent text-accent-foreground'
                          : 'text-popover-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden sm:flex items-center space-x-2 ml-4 pl-4 border-l border-border">
            <Button variant="ghost" size="sm" iconName="Bell" iconSize={18}>
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="sm" iconName="Settings" iconSize={18}>
              <span className="sr-only">Settings</span>
            </Button>
            <Button variant="ghost" size="sm" iconName="User" iconSize={18}>
              <span className="sr-only">Profile</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation Overlay */}
      {isMoreMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-150 lg:hidden"
          onClick={() => setIsMoreMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;