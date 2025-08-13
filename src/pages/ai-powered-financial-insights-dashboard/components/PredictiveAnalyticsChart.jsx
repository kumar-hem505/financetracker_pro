import React, { useState } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PredictiveAnalyticsChart = () => {
  const [selectedMetric, setSelectedMetric] = useState('cashflow');
  const [timeframe, setTimeframe] = useState('6months');

  const cashFlowData = [
    { month: 'Jan 2024', actual: 2500000, predicted: null, confidence: null },
    { month: 'Feb 2024', actual: 2800000, predicted: null, confidence: null },
    { month: 'Mar 2024', actual: 2650000, predicted: null, confidence: null },
    { month: 'Apr 2024', actual: 3200000, predicted: null, confidence: null },
    { month: 'May 2024', actual: 2900000, predicted: null, confidence: null },
    { month: 'Jun 2024', actual: 3100000, predicted: null, confidence: null },
    { month: 'Jul 2024', actual: 2950000, predicted: null, confidence: null },
    { month: 'Aug 2024', actual: null, predicted: 3250000, confidenceHigh: 3450000, confidenceLow: 3050000 },
    { month: 'Sep 2024', actual: null, predicted: 3400000, confidenceHigh: 3650000, confidenceLow: 3150000 },
    { month: 'Oct 2024', actual: null, predicted: 3600000, confidenceHigh: 3900000, confidenceLow: 3300000 },
    { month: 'Nov 2024', actual: null, predicted: 3800000, confidenceHigh: 4150000, confidenceLow: 3450000 },
    { month: 'Dec 2024', actual: null, predicted: 4200000, confidenceHigh: 4600000, confidenceLow: 3800000 }
  ];

  const revenueData = [
    { month: 'Jan 2024', actual: 5200000, predicted: null },
    { month: 'Feb 2024', actual: 5800000, predicted: null },
    { month: 'Mar 2024', actual: 5650000, predicted: null },
    { month: 'Apr 2024', actual: 6200000, predicted: null },
    { month: 'May 2024', actual: 5900000, predicted: null },
    { month: 'Jun 2024', actual: 6100000, predicted: null },
    { month: 'Jul 2024', actual: 5950000, predicted: null },
    { month: 'Aug 2024', actual: null, predicted: 6350000, confidenceHigh: 6650000, confidenceLow: 6050000 },
    { month: 'Sep 2024', actual: null, predicted: 6500000, confidenceHigh: 6850000, confidenceLow: 6150000 },
    { month: 'Oct 2024', actual: null, predicted: 6800000, confidenceHigh: 7200000, confidenceLow: 6400000 },
    { month: 'Nov 2024', actual: null, predicted: 7200000, confidenceHigh: 7650000, confidenceLow: 6750000 },
    { month: 'Dec 2024', actual: null, predicted: 7800000, confidenceHigh: 8300000, confidenceLow: 7300000 }
  ];

  const expenseData = [
    { month: 'Jan 2024', actual: 2700000, predicted: null },
    { month: 'Feb 2024', actual: 3000000, predicted: null },
    { month: 'Mar 2024', actual: 3000000, predicted: null },
    { month: 'Apr 2024', actual: 3000000, predicted: null },
    { month: 'May 2024', actual: 3000000, predicted: null },
    { month: 'Jun 2024', actual: 3000000, predicted: null },
    { month: 'Jul 2024', actual: 3000000, predicted: null },
    { month: 'Aug 2024', actual: null, predicted: 3100000, confidenceHigh: 3250000, confidenceLow: 2950000 },
    { month: 'Sep 2024', actual: null, predicted: 3100000, confidenceHigh: 3300000, confidenceLow: 2900000 },
    { month: 'Oct 2024', actual: null, predicted: 3200000, confidenceHigh: 3450000, confidenceLow: 2950000 },
    { month: 'Nov 2024', actual: null, predicted: 3400000, confidenceHigh: 3700000, confidenceLow: 3100000 },
    { month: 'Dec 2024', actual: null, predicted: 3600000, confidenceHigh: 3950000, confidenceLow: 3250000 }
  ];

  const getChartData = () => {
    switch (selectedMetric) {
      case 'revenue':
        return revenueData;
      case 'expenses':
        return expenseData;
      default:
        return cashFlowData;
    }
  };

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000)?.toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000)?.toFixed(1)}L`;
    }
    return `₹${(value / 1000)?.toFixed(0)}K`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 financial-shadow-md">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.dataKey}:</span>
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

  const metrics = [
    { id: 'cashflow', label: 'Cash Flow', icon: 'TrendingUp' },
    { id: 'revenue', label: 'Revenue', icon: 'DollarSign' },
    { id: 'expenses', label: 'Expenses', icon: 'CreditCard' }
  ];

  const timeframes = [
    { id: '3months', label: '3M' },
    { id: '6months', label: '6M' },
    { id: '12months', label: '12M' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border financial-shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Predictive Analytics</h3>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Brain" size={16} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">ARIMA Model</span>
        </div>
      </div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Metric Selector */}
        <div className="flex items-center space-x-2">
          {metrics?.map((metric) => (
            <Button
              key={metric?.id}
              variant={selectedMetric === metric?.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric(metric?.id)}
              iconName={metric?.icon}
              iconSize={16}
            >
              {metric?.label}
            </Button>
          ))}
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Forecast:</span>
          {timeframes?.map((tf) => (
            <Button
              key={tf?.id}
              variant={timeframe === tf?.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(tf?.id)}
            >
              {tf?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value?.split(' ')?.[0]}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Confidence Interval */}
            <Area
              type="monotone"
              dataKey="confidenceHigh"
              stackId="1"
              stroke="none"
              fill="url(#confidenceGradient)"
              name="Confidence Range"
            />
            <Area
              type="monotone"
              dataKey="confidenceLow"
              stackId="1"
              stroke="none"
              fill="url(#confidenceGradient)"
            />
            
            {/* Actual Data */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#1e3a8a"
              strokeWidth={3}
              dot={{ fill: '#1e3a8a', strokeWidth: 2, r: 4 }}
              name="Actual"
            />
            
            {/* Predicted Data */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#10b981"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="Predicted"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm font-medium text-foreground">Growth Trend</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Predicted 15% growth in next quarter based on seasonal patterns
          </p>
        </div>

        <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-foreground">Confidence Level</span>
          </div>
          <p className="text-xs text-muted-foreground">
            85% accuracy based on 3 years of historical data analysis
          </p>
        </div>

        <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Target" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Key Factors</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Seasonal trends, market conditions, and historical performance
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsChart;