import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';

import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import ComplianceMetricsCard from './components/ComplianceMetricsCard';
import GSTLiabilityChart from './components/GSTLiabilityChart';
import FilingCalendar from './components/FilingCalendar';
import TransactionTable from './components/TransactionTable';
import QuickActions from './components/QuickActions';
import ComplianceAlerts from './components/ComplianceAlerts';

const GSTComplianceTaxAnalyticsDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('current-quarter');
  const [selectedReturnType, setSelectedReturnType] = useState('all');
  const [chartType, setChartType] = useState('bar');

  const periodOptions = [
    { value: 'current-month', label: 'Current Month (Aug 2024)' },
    { value: 'current-quarter', label: 'Current Quarter (Q1 FY25)' },
    { value: 'current-year', label: 'Current FY (2024-25)' },
    { value: 'previous-quarter', label: 'Previous Quarter (Q4 FY24)' },
    { value: 'previous-year', label: 'Previous FY (2023-24)' }
  ];

  const returnTypeOptions = [
    { value: 'all', label: 'All Returns' },
    { value: 'gstr-1', label: 'GSTR-1 (Outward Supplies)' },
    { value: 'gstr-2', label: 'GSTR-2 (Inward Supplies)' },
    { value: 'gstr-3b', label: 'GSTR-3B (Monthly Summary)' },
    { value: 'gstr-9', label: 'GSTR-9 (Annual Return)' }
  ];

  const chartTypeOptions = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'pie', label: 'Pie Chart' }
  ];

  const complianceMetrics = [
    {
      title: 'Total GST Liability',
      value: '₹23,45,000',
      subtitle: 'Current Quarter',
      icon: 'Receipt',
      trend: 'up',
      trendValue: '+12.5%',
      color: 'primary',
      status: 'compliant'
    },
    {
      title: 'Input Tax Credit',
      value: '₹8,75,000',
      subtitle: 'Available for utilization',
      icon: 'CreditCard',
      trend: 'up',
      trendValue: '+8.2%',
      color: 'success',
      status: 'compliant'
    },
    {
      title: 'Pending Returns',
      value: '3',
      subtitle: 'Overdue filings',
      icon: 'AlertTriangle',
      color: 'warning',
      status: 'pending',
      deadline: '20 Aug 2024'
    },
    {
      title: 'Compliance Score',
      value: '87%',
      subtitle: 'Overall compliance rating',
      icon: 'Shield',
      trend: 'down',
      trendValue: '-2.1%',
      color: 'accent',
      status: 'compliant'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`pt-16 pb-20 lg:pb-6 financial-transition ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      }`}>
        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                GST Compliance & Tax Analytics
              </h1>
              <p className="text-muted-foreground">
                Monitor tax liability, filing status, and regulatory compliance for Indian tax requirements
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                options={periodOptions}
                value={selectedPeriod}
                onChange={setSelectedPeriod}
                className="w-full sm:w-48"
              />
              <Select
                options={returnTypeOptions}
                value={selectedReturnType}
                onChange={setSelectedReturnType}
                className="w-full sm:w-48"
              />
              <Button variant="default" iconName="RefreshCw" iconSize={16}>
                Sync Data
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {complianceMetrics?.map((metric, index) => (
              <ComplianceMetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                subtitle={metric?.subtitle}
                icon={metric?.icon}
                trend={metric?.trend}
                trendValue={metric?.trendValue}
                color={metric?.color}
                status={metric?.status}
                deadline={metric?.deadline}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Chart Section - 8 cols equivalent */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">GST Liability Analysis</h3>
                  <Select
                    options={chartTypeOptions}
                    value={chartType}
                    onChange={setChartType}
                    className="w-32"
                  />
                </div>
                <GSTLiabilityChart chartType={chartType} data={[]} />
              </div>

              {/* Compliance Alerts */}
              <ComplianceAlerts />
            </div>

            {/* Right Panel - 4 cols equivalent */}
            <div className="space-y-6">
              <FilingCalendar />
              <QuickActions />
            </div>
          </div>

          {/* Transaction Table */}
          <TransactionTable />

          {/* Additional Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Tax Rate Distribution</h3>
                <Button variant="ghost" size="sm" iconName="MoreHorizontal" iconSize={16}>
                  <span className="sr-only">More options</span>
                </Button>
              </div>
              
              <div className="space-y-4">
                {[
                  { rate: '18% GST', amount: 948000, percentage: 45.2, color: 'bg-primary' },
                  { rate: '12% GST', amount: 540000, percentage: 25.8, color: 'bg-accent' },
                  { rate: '5% GST', amount: 319000, percentage: 15.2, color: 'bg-success' },
                  { rate: '28% GST', amount: 257000, percentage: 12.3, color: 'bg-warning' },
                  { rate: '0% GST', amount: 32000, percentage: 1.5, color: 'bg-muted' }
                ]?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item?.color}`} />
                      <span className="text-sm font-medium text-foreground">{item?.rate}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        ₹{item?.amount?.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-muted-foreground">{item?.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Compliance Timeline</h3>
                <Button variant="ghost" size="sm" iconName="Calendar" iconSize={16}>
                  View Calendar
                </Button>
              </div>
              
              <div className="space-y-4">
                {[
                  { date: '11 Aug 2024', event: 'GSTR-1 Due', status: 'overdue', priority: 'high' },
                  { date: '20 Aug 2024', event: 'GSTR-3B Due', status: 'upcoming', priority: 'high' },
                  { date: '25 Aug 2024', event: 'TDS Return Due', status: 'upcoming', priority: 'medium' },
                  { date: '31 Aug 2024', event: 'GSTR-4 Due', status: 'upcoming', priority: 'low' },
                  { date: '15 Sep 2024', event: 'Advance Tax Due', status: 'scheduled', priority: 'medium' }
                ]?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        item?.status === 'overdue' ? 'bg-error' :
                        item?.status === 'upcoming'? 'bg-warning' : 'bg-muted-foreground'
                      }`} />
                      <div>
                        <div className="text-sm font-medium text-foreground">{item?.event}</div>
                        <div className="text-xs text-muted-foreground">{item?.date}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item?.priority === 'high' ? 'bg-error/10 text-error' :
                      item?.priority === 'medium'? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                    }`}>
                      {item?.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GSTComplianceTaxAnalyticsDashboard;