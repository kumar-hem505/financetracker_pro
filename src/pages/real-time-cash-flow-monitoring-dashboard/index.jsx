import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import dashboard components
import DashboardControls from './components/DashboardControls';
import CashFlowMetrics from './components/CashFlowMetrics';
import CashFlowWaterfall from './components/CashFlowWaterfall';
import AccountsReceivableAging from './components/AccountsReceivableAging';
import LiveTransactionFeed from './components/LiveTransactionFeed';
import CashFlowForecast from './components/CashFlowForecast';

const RealTimeCashFlowMonitoringDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [timeRange, setTimeRange] = useState('today');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock data for cash flow metrics
  const mockMetrics = {
    currentCash: 2640000,
    cashChange: 5.8,
    dailyInflow: 1170000,
    inflowChange: 12.3,
    dailyOutflow: 1030000,
    outflowChange: -8.7,
    pendingReceivables: 2995000,
    receivablesChange: -2.1
  };

  useEffect(() => {
    // Simulate initial data loading
    const loadDashboardData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDashboardData(mockMetrics);
      setIsLoading(false);
    };

    loadDashboardData();
  }, [selectedAccount, timeRange]);

  useEffect(() => {
    // Set up auto-refresh if enabled
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        setDashboardData(prev => ({
          ...prev,
          currentCash: prev?.currentCash + Math.floor(Math.random() * 10000) - 5000,
          dailyInflow: prev?.dailyInflow + Math.floor(Math.random() * 5000),
          dailyOutflow: prev?.dailyOutflow + Math.floor(Math.random() * 3000)
        }));
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleAccountChange = (account) => {
    setSelectedAccount(account);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleRefreshToggle = (enabled, interval) => {
    setAutoRefresh(enabled);
  };

  const handleExport = () => {
    // Simulate export functionality
    const exportData = {
      account: selectedAccount,
      timeRange: timeRange,
      metrics: dashboardData,
      exportedAt: new Date()?.toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cash-flow-report-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleWaterfallDrillDown = (data) => {
    console.log('Drilling down into waterfall data:', data);
    // In a real app, this would navigate to detailed transaction view
  };

  const handleReceivableDetails = () => {
    console.log('Viewing receivable details');
    // In a real app, this would open detailed receivables view
  };

  const handleProcessPayment = (transaction) => {
    console.log('Processing payment for transaction:', transaction);
    // In a real app, this would open payment processing modal
  };

  const handleViewTransaction = (transaction) => {
    console.log('Viewing transaction details:', transaction);
    // In a real app, this would open transaction detail modal
  };

  const handleScenarioModeling = () => {
    console.log('Opening scenario modeling');
    // In a real app, this would open scenario modeling interface
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className={`pt-16 pb-20 lg:pb-0 financial-transition ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Icon name="TrendingUp" size={24} color="white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">Loading Cash Flow Dashboard</h3>
                  <p className="text-muted-foreground">Fetching real-time financial data...</p>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <main className={`pt-16 pb-20 lg:pb-0 financial-transition ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      }`}>
        <div className="p-6 space-y-6">
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Icon name="TrendingUp" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Real-time Cash Flow Monitoring</h1>
                <p className="text-muted-foreground">Live visibility into cash position and payment flows</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-3 py-1 bg-green-50 rounded-full">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-success">Live Updates</span>
              </div>
              <Button
                variant="default"
                iconName="Plus"
                iconSize={16}
              >
                Add Transaction
              </Button>
            </div>
          </div>

          {/* Dashboard Controls */}
          <DashboardControls
            onAccountChange={handleAccountChange}
            onTimeRangeChange={handleTimeRangeChange}
            onRefreshToggle={handleRefreshToggle}
            onExport={handleExport}
          />

          {/* Cash Flow Metrics */}
          <CashFlowMetrics metrics={dashboardData} isLoading={false} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            
            {/* Left Section - Charts (12 cols equivalent) */}
            <div className="xl:col-span-3 space-y-6">
              
              {/* Cash Flow Waterfall */}
              <CashFlowWaterfall
                data={dashboardData}
                onDrillDown={handleWaterfallDrillDown}
              />

              {/* Accounts Receivable Aging */}
              <AccountsReceivableAging
                onViewDetails={handleReceivableDetails}
              />

              {/* Cash Flow Forecast */}
              <CashFlowForecast
                onScenarioModel={handleScenarioModeling}
              />
            </div>

            {/* Right Section - Live Feed (4 cols equivalent) */}
            <div className="xl:col-span-1">
              <LiveTransactionFeed
                onProcessPayment={handleProcessPayment}
                onViewTransaction={handleViewTransaction}
              />
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="bg-card rounded-lg border border-border p-4 financial-shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Icon name="Zap" size={16} className="text-warning" />
                <span className="text-sm font-medium text-foreground">Quick Actions</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" iconName="CreditCard" iconSize={14}>
                  Process Payment
                </Button>
                <Button variant="outline" size="sm" iconName="FileText" iconSize={14}>
                  Generate Report
                </Button>
                <Button variant="outline" size="sm" iconName="Bell" iconSize={14}>
                  Set Alert
                </Button>
                <Button variant="outline" size="sm" iconName="Calculator" iconSize={14}>
                  Cash Flow Calculator
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RealTimeCashFlowMonitoringDashboard;