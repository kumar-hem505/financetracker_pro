import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const BudgetUtilizationGauge = () => {
  const utilizationData = [
    { name: 'Used', value: 78, color: 'var(--color-accent)' },
    { name: 'Remaining', value: 22, color: 'var(--color-muted)' }
  ];

  const budgetBreakdown = [
    { category: 'Operations', allocated: 15000000, used: 12500000, percentage: 83 },
    { category: 'Marketing', allocated: 8000000, used: 5800000, percentage: 73 },
    { category: 'Technology', allocated: 12000000, used: 9200000, percentage: 77 },
    { category: 'HR & Admin', allocated: 6000000, used: 4200000, percentage: 70 }
  ];

  const formatCurrency = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000)?.toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000)?.toFixed(1)}L`;
    return `₹${(value / 1000)?.toFixed(0)}K`;
  };

  const getUtilizationColor = (percentage) => {
    if (percentage >= 90) return 'text-error';
    if (percentage >= 75) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 financial-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Budget Utilization</h3>
          <p className="text-sm text-muted-foreground">FY 2024-25 Progress</p>
        </div>
        <Icon name="Target" size={20} className="text-muted-foreground" />
      </div>
      {/* Gauge Chart */}
      <div className="relative mb-6">
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={utilizationData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={40}
                outerRadius={60}
                dataKey="value"
              >
                {utilizationData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">78%</span>
          <span className="text-xs text-muted-foreground">Utilized</span>
        </div>
      </div>
      {/* Budget Breakdown */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Department Breakdown</h4>
        {budgetBreakdown?.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{item?.category}</span>
              <span className={`text-sm font-medium ${getUtilizationColor(item?.percentage)}`}>
                {item?.percentage}%
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(item?.used)} used</span>
              <span>{formatCurrency(item?.allocated)} allocated</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full financial-transition ${
                  item?.percentage >= 90 ? 'bg-error' :
                  item?.percentage >= 75 ? 'bg-warning' : 'bg-success'
                }`}
                style={{ width: `${item?.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Budget:</span>
          <span className="font-medium text-foreground">₹41.0Cr</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-muted-foreground">Remaining:</span>
          <span className="font-medium text-success">₹9.0Cr</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetUtilizationGauge;