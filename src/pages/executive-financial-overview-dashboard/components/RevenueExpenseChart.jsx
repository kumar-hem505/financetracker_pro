import React, { useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Button from '../../../components/ui/Button';

const RevenueExpenseChart = () => {
  const [timeRange, setTimeRange] = useState('12M');
  const [showForecast, setShowForecast] = useState(true);

  const chartData = [
    { month: 'Apr 2024', revenue: 2850000, expenses: 1950000, forecast: null },
    { month: 'May 2024', revenue: 3200000, expenses: 2100000, forecast: null },
    { month: 'Jun 2024', revenue: 2950000, expenses: 2050000, forecast: null },
    { month: 'Jul 2024', revenue: 3450000, expenses: 2200000, forecast: null },
    { month: 'Aug 2024', revenue: 3100000, expenses: 2150000, forecast: null },
    { month: 'Sep 2024', revenue: 3650000, expenses: 2300000, forecast: null },
    { month: 'Oct 2024', revenue: 3200000, expenses: 2180000, forecast: null },
    { month: 'Nov 2024', revenue: 3800000, expenses: 2400000, forecast: null },
    { month: 'Dec 2024', revenue: 4200000, expenses: 2650000, forecast: null },
    { month: 'Jan 2025', revenue: 3900000, expenses: 2500000, forecast: null },
    { month: 'Feb 2025', revenue: 4100000, expenses: 2600000, forecast: null },
    { month: 'Mar 2025', revenue: 4350000, expenses: 2750000, forecast: null },
    { month: 'Apr 2025', revenue: null, expenses: null, forecast: 4500000 },
    { month: 'May 2025', revenue: null, expenses: null, forecast: 4650000 },
    { month: 'Jun 2025', revenue: null, expenses: null, forecast: 4800000 }
  ];

  const formatCurrency = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000)?.toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000)?.toFixed(1)}L`;
    return `₹${(value / 1000)?.toFixed(0)}K`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 financial-shadow-md">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-medium text-popover-foreground">
                {formatCurrency(entry?.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 financial-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue vs Expenses</h3>
          <p className="text-sm text-muted-foreground">Monthly performance with AI forecast</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={showForecast ? "default" : "outline"}
            size="sm"
            onClick={() => setShowForecast(!showForecast)}
            iconName="Brain"
            iconSize={16}
          >
            AI Forecast
          </Button>
          <div className="flex items-center bg-muted rounded-lg p-1">
            {['6M', '12M', '24M']?.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm font-medium rounded-md financial-transition ${
                  timeRange === range
                    ? 'bg-background text-foreground financial-shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => value?.split(' ')?.[0]}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="revenue" 
              name="Revenue" 
              fill="var(--color-accent)" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="expenses" 
              name="Expenses" 
              fill="var(--color-warning)" 
              radius={[2, 2, 0, 0]}
            />
            {showForecast && (
              <Line 
                type="monotone" 
                dataKey="forecast" 
                name="AI Forecast" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueExpenseChart;