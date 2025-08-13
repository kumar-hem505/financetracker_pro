import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DepartmentalSpendingHeatmap = () => {
  const [selectedView, setSelectedView] = useState('variance');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const departmentData = [
    {
      department: 'Operations',
      budget: 15000000,
      actual: 12500000,
      variance: -16.7,
      trend: 'positive',
      lastMonth: 13200000,
      categories: ['Procurement', 'Logistics', 'Quality Control', 'Maintenance']
    },
    {
      department: 'Technology',
      budget: 12000000,
      actual: 13800000,
      variance: 15.0,
      trend: 'negative',
      lastMonth: 11500000,
      categories: ['Software', 'Hardware', 'Cloud Services', 'Development']
    },
    {
      department: 'Marketing',
      budget: 8000000,
      actual: 7200000,
      variance: -10.0,
      trend: 'positive',
      lastMonth: 8500000,
      categories: ['Digital Marketing', 'Events', 'Content', 'PR']
    },
    {
      department: 'Sales',
      budget: 10000000,
      actual: 11200000,
      variance: 12.0,
      trend: 'negative',
      lastMonth: 9800000,
      categories: ['Travel', 'Commissions', 'Tools', 'Training']
    },
    {
      department: 'HR & Admin',
      budget: 6000000,
      actual: 5800000,
      variance: -3.3,
      trend: 'positive',
      lastMonth: 6100000,
      categories: ['Recruitment', 'Training', 'Benefits', 'Office']
    },
    {
      department: 'Finance',
      budget: 4000000,
      actual: 3900000,
      variance: -2.5,
      trend: 'positive',
      lastMonth: 4200000,
      categories: ['Audit', 'Compliance', 'Banking', 'Insurance']
    }
  ];

  const formatCurrency = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000)?.toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000)?.toFixed(1)}L`;
    return `₹${(value / 1000)?.toFixed(0)}K`;
  };

  const getVarianceColor = (variance) => {
    if (Math.abs(variance) <= 5) return 'bg-success/20 text-success border-success/30';
    if (Math.abs(variance) <= 15) return 'bg-warning/20 text-warning border-warning/30';
    return 'bg-error/20 text-error border-error/30';
  };

  const getVarianceIntensity = (variance) => {
    const intensity = Math.min(Math.abs(variance) / 20, 1);
    if (variance > 0) {
      return `rgba(239, 68, 68, ${0.1 + intensity * 0.3})`; // Red for over-budget
    } else {
      return `rgba(16, 185, 129, ${0.1 + intensity * 0.3})`; // Green for under-budget
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'positive' ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 financial-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Departmental Spending Analysis</h3>
          <p className="text-sm text-muted-foreground">Budget variance and trend analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            {['variance', 'actual', 'trend']?.map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-3 py-1 text-sm font-medium rounded-md financial-transition capitalize ${
                  selectedView === view
                    ? 'bg-background text-foreground financial-shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e?.target?.value)}
            className="text-sm border border-border rounded-md px-3 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
      {/* Heatmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {departmentData?.map((dept, index) => (
          <div 
            key={index}
            className="relative p-4 rounded-lg border financial-transition hover:financial-shadow-md cursor-pointer"
            style={{ 
              backgroundColor: selectedView === 'variance' ? getVarianceIntensity(dept?.variance) : 'var(--color-card)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-foreground">{dept?.department}</h4>
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getTrendIcon(dept?.trend)} 
                  size={14} 
                  className={dept?.trend === 'positive' ? 'text-success' : 'text-error'}
                />
                <span className={`text-xs font-medium ${
                  dept?.variance > 0 ? 'text-error' : 'text-success'
                }`}>
                  {dept?.variance > 0 ? '+' : ''}{dept?.variance?.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Budget:</span>
                <span className="font-medium text-foreground">{formatCurrency(dept?.budget)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Actual:</span>
                <span className="font-medium text-foreground">{formatCurrency(dept?.actual)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Last Month:</span>
                <span className="font-medium text-foreground">{formatCurrency(dept?.lastMonth)}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full financial-transition ${
                    dept?.variance > 0 ? 'bg-error' : 'bg-success'
                  }`}
                  style={{ width: `${Math.min((dept?.actual / dept?.budget) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {dept?.categories?.slice(0, 2)?.map((category, catIndex) => (
                  <span 
                    key={catIndex}
                    className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md"
                  >
                    {category}
                  </span>
                ))}
                {dept?.categories?.length > 2 && (
                  <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md">
                    +{dept?.categories?.length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-success/30 rounded border border-success/50" />
            <span className="text-xs text-muted-foreground">Under Budget</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-warning/30 rounded border border-warning/50" />
            <span className="text-xs text-muted-foreground">Near Budget</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-error/30 rounded border border-error/50" />
            <span className="text-xs text-muted-foreground">Over Budget</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" iconName="Download" iconSize={14}>
          Export Report
        </Button>
      </div>
    </div>
  );
};

export default DepartmentalSpendingHeatmap;