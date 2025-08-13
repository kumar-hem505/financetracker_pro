import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';


const ExpenseCategoriesChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const expenseData = [
    { name: 'Operations', value: 12500000, color: '#1e3a8a', percentage: 35 },
    { name: 'Salaries', value: 8900000, color: '#10b981', percentage: 25 },
    { name: 'Marketing', value: 5800000, color: '#d97706', percentage: 16 },
    { name: 'Technology', value: 4200000, color: '#dc2626', percentage: 12 },
    { name: 'Utilities', value: 2800000, color: '#7c3aed', percentage: 8 },
    { name: 'Others', value: 1400000, color: '#6b7280', percentage: 4 }
  ];

  const formatCurrency = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000)?.toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000)?.toFixed(1)}L`;
    return `₹${(value / 1000)?.toFixed(0)}K`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 financial-shadow-md">
          <div className="flex items-center space-x-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data?.color }}
            />
            <span className="text-sm font-medium text-popover-foreground">{data?.name}</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium text-popover-foreground">
                {formatCurrency(data?.value)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Percentage:</span>
              <span className="font-medium text-popover-foreground">{data?.percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 financial-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Top Expense Categories</h3>
          <p className="text-sm text-muted-foreground">Current month breakdown</p>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e?.target?.value)}
            className="text-sm border border-border rounded-md px-3 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="current">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {expenseData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Category List */}
      <div className="space-y-3">
        {expenseData?.map((category, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0" 
                style={{ backgroundColor: category?.color }}
              />
              <div>
                <span className="text-sm font-medium text-foreground">{category?.name}</span>
                <div className="text-xs text-muted-foreground">{category?.percentage}% of total</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">
                {formatCurrency(category?.value)}
              </div>
              <div className="text-xs text-muted-foreground">
                {category?.percentage >= 20 ? 'High' : category?.percentage >= 10 ? 'Medium' : 'Low'}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Total */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total Expenses:</span>
          <span className="text-lg font-bold text-foreground">₹3.56Cr</span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCategoriesChart;