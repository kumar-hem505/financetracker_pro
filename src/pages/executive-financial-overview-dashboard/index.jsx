import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import KPICard from './components/KPICard';
import RevenueExpenseChart from './components/RevenueExpenseChart';
import BudgetUtilizationGauge from './components/BudgetUtilizationGauge';
import ExpenseCategoriesChart from './components/ExpenseCategoriesChart';
import CriticalAlertsFeed from './components/CriticalAlertsFeed';
import DepartmentalSpendingHeatmap from './components/DepartmentalSpendingHeatmap';
import FiscalYearSelector from './components/FiscalYearSelector';

const ExecutiveFinancialOverviewDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState('FY 2024-25');
  const [comparisonMode, setComparisonMode] = useState('YoY');
  const [aiInsightsEnabled, setAiInsightsEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock KPI data
  const kpiData = [
    {
      title: 'Cash Flow',
      value: '₹2.8Cr',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'success'
    },
    {
      title: 'Revenue Growth',
      value: '₹4.35Cr',
      change: '+8.2%',
      changeType: 'positive',
      icon: 'BarChart3',
      color: 'primary'
    },
    {
      title: 'Profit Margin',
      value: '18.4%',
      change: '-2.1%',
      changeType: 'negative',
      icon: 'PieChart',
      color: 'warning'
    },
    {
      title: 'Financial Health',
      value: '87/100',
      change: '+5.3%',
      changeType: 'positive',
      icon: 'Shield',
      color: 'success'
    }
  ];

  // Auto-refresh data every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleFiscalYearChange = (year) => {
    setSelectedFiscalYear(year);
  };

  const handleComparisonToggle = (mode) => {
    setComparisonMode(mode);
  };

  const handleAIToggle = (enabled) => {
    setAiInsightsEnabled(enabled);
  };

  return (
    <>
      <Helmet>
        <title>Executive Financial Overview Dashboard - FinanceTracker Pro</title>
        <meta name="description" content="Comprehensive financial health monitoring with high-level KPIs and strategic insights for executives and senior stakeholders." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <main className={`pt-16 pb-20 lg:pb-8 financial-transition ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
        }`}>
          <div className="p-6 space-y-6">
            
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Executive Financial Overview</h1>
                <p className="text-muted-foreground">
                  Strategic financial insights and performance monitoring for {selectedFiscalYear}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {lastUpdated?.toLocaleTimeString()}
              </div>
            </div>

            {/* Fiscal Year Selector & Controls */}
            <FiscalYearSelector
              onYearChange={handleFiscalYearChange}
              onComparisonToggle={handleComparisonToggle}
              onAIToggle={handleAIToggle}
            />

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiData?.map((kpi, index) => (
                <KPICard
                  key={index}
                  title={kpi?.title}
                  value={kpi?.value}
                  change={kpi?.change}
                  changeType={kpi?.changeType}
                  icon={kpi?.icon}
                  color={kpi?.color}
                />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Revenue vs Expenses Chart - 8 columns */}
              <div className="lg:col-span-8">
                <RevenueExpenseChart />
              </div>

              {/* Right Sidebar - 4 columns */}
              <div className="lg:col-span-4 space-y-6">
                <BudgetUtilizationGauge />
                <ExpenseCategoriesChart />
                <CriticalAlertsFeed />
              </div>
            </div>

            {/* Departmental Spending Heatmap - Full Width */}
            <DepartmentalSpendingHeatmap />

            {/* Quick Stats Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-lg p-4 financial-shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Outstanding Invoices</p>
                    <p className="text-xl font-bold text-foreground">₹12.5L</p>
                  </div>
                  <div className="p-3 bg-warning/20 rounded-lg">
                    <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  23 invoices overdue
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4 financial-shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tax Liabilities</p>
                    <p className="text-xl font-bold text-foreground">₹8.2L</p>
                  </div>
                  <div className="p-3 bg-error/20 rounded-lg">
                    <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  GST & TDS pending
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4 financial-shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Working Capital</p>
                    <p className="text-xl font-bold text-foreground">₹15.8Cr</p>
                  </div>
                  <div className="p-3 bg-success/20 rounded-lg">
                    <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Healthy liquidity position
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ExecutiveFinancialOverviewDashboard;