import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import BudgetKPICard from './components/BudgetKPICard';
import BudgetVarianceChart from './components/BudgetVarianceChart';
import DepartmentRankingTable from './components/DepartmentRankingTable';
import SpendingHeatMap from './components/SpendingHeatMap';
import BudgetFilters from './components/BudgetFilters';
import AIInsightsPanel from './components/AIInsightsPanel';

const BudgetPerformanceAnalyticsDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState(['all']);
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [varianceThreshold, setVarianceThreshold] = useState('all');
  const [lastUpdated, setLastUpdated] = useState('2 minutes ago');

  // Mock data for KPI cards
  const kpiData = [
    {
      title: 'Budget Utilization',
      value: '78.5%',
      change: '+2.3%',
      changeType: 'positive',
      icon: 'Target',
      subtitle: 'Current month',
      sparklineData: [65, 70, 72, 75, 78, 76, 78.5]
    },
    {
      title: 'Variance Amount',
      value: '₹12.4L',
      change: '-₹3.2L',
      changeType: 'positive',
      icon: 'TrendingDown',
      subtitle: 'Under budget',
      sparklineData: [15, 18, 14, 16, 13, 11, 12.4]
    },
    {
      title: 'Burn Rate',
      value: '₹45.6L/month',
      change: '+8.2%',
      changeType: 'negative',
      icon: 'Flame',
      subtitle: 'Monthly average',
      sparklineData: [42, 44, 43, 46, 48, 47, 45.6]
    },
    {
      title: 'Projected Overspend',
      value: '₹8.9L',
      change: '+₹2.1L',
      changeType: 'negative',
      icon: 'AlertTriangle',
      subtitle: 'End of quarter',
      sparklineData: [5, 6, 7, 8, 9, 8.5, 8.9]
    }
  ];

  // Mock data for budget variance chart
  const budgetVarianceData = [
    { category: 'Engineering', budgeted: 5000000, actual: 4750000 },
    { category: 'Marketing', budgeted: 2500000, actual: 2890000 },
    { category: 'Sales', budgeted: 3200000, actual: 3150000 },
    { category: 'HR', budgeted: 1800000, actual: 1650000 },
    { category: 'Operations', budgeted: 2200000, actual: 2450000 },
    { category: 'IT', budgeted: 1500000, actual: 1380000 },
    { category: 'Finance', budgeted: 1200000, actual: 1100000 },
    { category: 'Legal', budgeted: 800000, actual: 920000 }
  ];

  // Mock data for department ranking
  const departmentData = [
    {
      id: 1,
      name: 'Finance',
      budget: 1200000,
      spent: 1100000,
      score: 92,
      trend: 'positive'
    },
    {
      id: 2,
      name: 'IT',
      budget: 1500000,
      spent: 1380000,
      score: 89,
      trend: 'positive'
    },
    {
      id: 3,
      name: 'HR',
      budget: 1800000,
      spent: 1650000,
      score: 85,
      trend: 'positive'
    },
    {
      id: 4,
      name: 'Engineering',
      budget: 5000000,
      spent: 4750000,
      score: 82,
      trend: 'neutral'
    },
    {
      id: 5,
      name: 'Sales',
      budget: 3200000,
      spent: 3150000,
      score: 78,
      trend: 'positive'
    },
    {
      id: 6,
      name: 'Operations',
      budget: 2200000,
      spent: 2450000,
      score: 65,
      trend: 'negative'
    },
    {
      id: 7,
      name: 'Marketing',
      budget: 2500000,
      spent: 2890000,
      score: 58,
      trend: 'negative'
    },
    {
      id: 8,
      name: 'Legal',
      budget: 800000,
      spent: 920000,
      score: 52,
      trend: 'negative'
    }
  ];

  // Mock data for heat map
  const categories = ['Engineering', 'Marketing', 'Sales', 'HR', 'Operations', 'IT', 'Finance', 'Legal'];
  const timePeriods = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const heatMapData = categories?.map(() => 
    timePeriods?.map(() => ({
      amount: Math.floor(Math.random() * 1000000) + 200000,
      variance: (Math.random() - 0.5) * 40 // -20% to +20%
    }))
  );

  // Mock AI insights data
  const aiInsights = [
    {
      id: 1,
      type: 'anomaly',
      severity: 'high',
      title: 'Unusual Marketing Spend Detected',
      summary: 'Marketing department exceeded budget by 15.6% this month',
      details: `The marketing department has shown an unusual spending pattern with a 15.6% budget overrun. This is primarily driven by increased digital advertising costs and unplanned campaign expenses.`,
      recommendations: [
        'Review and optimize digital advertising spend',
        'Implement stricter approval process for campaign expenses',
        'Consider reallocating budget from underperforming channels'
      ],
      impact: 'Potential savings of ₹3.8L per month with recommended optimizations',
      timestamp: '2 hours ago',
      actionRequired: true
    },
    {
      id: 2,
      type: 'optimization',
      severity: 'medium',
      title: 'IT Budget Underutilization Opportunity',
      summary: 'IT department consistently under budget - potential reallocation opportunity',
      details: `The IT department has been consistently under budget by 8-12% over the past 3 months. This presents an opportunity for strategic reallocation or investment in infrastructure improvements.`,
      recommendations: [
        'Consider investing in cloud infrastructure upgrades',
        'Allocate funds for employee training and certifications',
        'Reallocate surplus to high-priority departments'
      ],
      impact: 'Opportunity to optimize ₹1.2L monthly allocation',
      timestamp: '4 hours ago',
      actionRequired: false
    },
    {
      id: 3,
      type: 'prediction',
      severity: 'medium',
      title: 'Q4 Budget Forecast Alert',
      summary: 'Projected 12% overspend in Operations for Q4',
      details: `Based on current spending trends and seasonal patterns, the Operations department is projected to exceed its Q4 budget by approximately 12%. This is driven by increased logistics costs and seasonal workforce expansion.`,
      recommendations: [
        'Implement cost control measures for logistics',
        'Review seasonal staffing strategy',
        'Consider budget reallocation from other departments'
      ],
      impact: 'Proactive measures could reduce overspend to 5-7%',
      timestamp: '6 hours ago',
      actionRequired: true
    }
  ];

  const handleCategoryClick = (data) => {
    console.log('Category clicked:', data);
    // Handle category drill-down
  };

  const handleDepartmentClick = (department) => {
    console.log('Department clicked:', department);
    // Handle department detail view
  };

  const handleInsightClick = (insight) => {
    console.log('Insight clicked:', insight);
    // Handle insight action
  };

  const handleSaveView = () => {
    console.log('Saving current view configuration');
    // Handle save view functionality
  };

  const handleRefresh = () => {
    setLastUpdated('Just now');
    console.log('Refreshing data');
    // Handle data refresh
  };

  useEffect(() => {
    // Simulate periodic data updates
    const interval = setInterval(() => {
      const now = new Date();
      const minutes = Math.floor((now?.getTime() - Date.now()) / 60000) + Math.floor(Math.random() * 5) + 1;
      setLastUpdated(`${minutes} minute${minutes !== 1 ? 's' : ''} ago`);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Budget Performance Analytics</h1>
              <p className="text-muted-foreground mt-1">
                Track spending patterns, analyze variances, and optimize resource allocation
              </p>
            </div>
            <div className="mt-4 sm:mt-0 text-sm text-muted-foreground">
              Financial Year 2024-25 | Last updated: {lastUpdated}
            </div>
          </div>

          {/* Filters */}
          <BudgetFilters
            selectedDepartments={selectedDepartments}
            onDepartmentChange={setSelectedDepartments}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            varianceThreshold={varianceThreshold}
            onVarianceThresholdChange={setVarianceThreshold}
            onSaveView={handleSaveView}
            onRefresh={handleRefresh}
            lastUpdated={lastUpdated}
          />

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData?.map((kpi, index) => (
              <BudgetKPICard key={index} {...kpi} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Budget Variance Chart - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <BudgetVarianceChart 
                data={budgetVarianceData}
                onCategoryClick={handleCategoryClick}
              />
            </div>

            {/* Department Ranking - Takes 1 column */}
            <div className="xl:col-span-1">
              <DepartmentRankingTable 
                departments={departmentData}
                onDepartmentClick={handleDepartmentClick}
              />
            </div>
          </div>

          {/* Heat Map - Full width */}
          <SpendingHeatMap 
            data={heatMapData}
            categories={categories}
            timePeriods={timePeriods}
          />

          {/* AI Insights Panel */}
          <AIInsightsPanel 
            insights={aiInsights}
            onInsightClick={handleInsightClick}
          />
        </div>
      </main>
    </div>
  );
};

export default BudgetPerformanceAnalyticsDashboard;