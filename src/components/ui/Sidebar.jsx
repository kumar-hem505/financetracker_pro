import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const [notificationCounts, setNotificationCounts] = useState({
    '/real-time-cash-flow-monitoring-dashboard': 3,
    '/gst-compliance-tax-analytics-dashboard': 2,
    '/budget-performance-analytics-dashboard': 1
  });
  
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Executive Dashboard',
      path: '/executive-financial-overview-dashboard',
      icon: 'LayoutDashboard',
      description: 'Strategic financial overview and KPIs'
    },
    {
      label: 'Cash Flow Monitor',
      path: '/real-time-cash-flow-monitoring-dashboard',
      icon: 'TrendingUp',
      description: 'Real-time liquidity and cash position',
      badge: notificationCounts?.['/real-time-cash-flow-monitoring-dashboard']
    },
    {
      label: 'Budget Analytics',
      path: '/budget-performance-analytics-dashboard',
      icon: 'BarChart3',
      description: 'Budget performance and variance analysis',
      badge: notificationCounts?.['/budget-performance-analytics-dashboard']
    },
    {
      label: 'Tax Compliance',
      path: '/gst-compliance-tax-analytics-dashboard',
      icon: 'FileText',
      description: 'GST compliance and regulatory monitoring',
      badge: notificationCounts?.['/gst-compliance-tax-analytics-dashboard']
    },
    {
      label: 'AI Insights',
      path: '/ai-powered-financial-insights-dashboard',
      icon: 'Brain',
      description: 'Intelligent financial analysis and predictions'
    }
  ];

  const isActivePath = (path) => location?.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 z-100 h-screen bg-card border-r border-border financial-shadow-sm financial-transition ${
        isCollapsed ? 'w-16' : 'w-72'
      } hidden lg:flex flex-col`}>
        
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          {!isCollapsed && (
            <Link to="/executive-financial-overview-dashboard" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Icon name="DollarSign" size={20} color="white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground font-sans">FinanceTracker</span>
                <span className="text-xs text-muted-foreground font-medium">Pro</span>
              </div>
            </Link>
          )}
          
          {isCollapsed && (
            <Link to="/executive-financial-overview-dashboard" className="flex items-center justify-center w-full">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Icon name="DollarSign" size={20} color="white" strokeWidth={2.5} />
              </div>
            </Link>
          )}
          
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
              iconSize={16}
              className={isCollapsed ? "ml-0" : ""}
            >
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems?.map((item) => (
            <div key={item?.path} className="relative group">
              <Link
                to={item?.path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium financial-transition min-h-[48px] ${
                  isActivePath(item?.path)
                    ? 'bg-accent text-accent-foreground financial-shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <div className="flex-shrink-0 relative">
                  <Icon name={item?.icon} size={20} />
                  {item?.badge && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-error rounded-full">
                      {item?.badge}
                    </span>
                  )}
                </div>
                
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{item?.label}</div>
                  </div>
                )}
              </Link>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-popover border border-border rounded-lg financial-shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible financial-transition z-200 whitespace-nowrap">
                  <div className="text-sm font-medium text-popover-foreground">{item?.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item?.description}</div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="px-4 py-4 border-t border-border space-y-2">
          <Button
            variant="ghost"
            size="sm"
            fullWidth={!isCollapsed}
            iconName="Settings"
            iconSize={18}
            className={isCollapsed ? "justify-center" : "justify-start"}
          >
            {!isCollapsed && "Settings"}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            fullWidth={!isCollapsed}
            iconName="HelpCircle"
            iconSize={18}
            className={isCollapsed ? "justify-center" : "justify-start"}
          >
            {!isCollapsed && "Help & Support"}
          </Button>
        </div>
      </aside>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-150 bg-card border-t border-border lg:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {navigationItems?.slice(0, 4)?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex flex-col items-center justify-center space-y-1 px-2 py-2 rounded-lg text-xs font-medium financial-transition min-w-[60px] ${
                isActivePath(item?.path)
                  ? 'text-accent' :'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <Icon name={item?.icon} size={20} />
                {item?.badge && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs font-medium text-white bg-error rounded-full">
                    {item?.badge > 9 ? '9+' : item?.badge}
                  </span>
                )}
              </div>
              <span className="truncate max-w-[50px]">
                {item?.label?.split(' ')?.[0]}
              </span>
            </Link>
          ))}
          
          {/* AI Insights in More Menu for Mobile */}
          <Link
            to="/ai-powered-financial-insights-dashboard"
            className={`flex flex-col items-center justify-center space-y-1 px-2 py-2 rounded-lg text-xs font-medium financial-transition min-w-[60px] ${
              isActivePath('/ai-powered-financial-insights-dashboard')
                ? 'text-accent' :'text-muted-foreground'
            }`}
          >
            <Icon name="Brain" size={20} />
            <span className="truncate max-w-[50px]">AI</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;