import React, { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CashFlowWaterfall = ({ data, onDrillDown }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [isLoading, setIsLoading] = useState(false);

  const waterfallData = [
    { name: 'Opening Balance', value: 2500000, cumulative: 2500000, type: 'opening' },
    { name: 'Sales Revenue', value: 850000, cumulative: 3350000, type: 'inflow' },
    { name: 'Service Income', value: 320000, cumulative: 3670000, type: 'inflow' },
    { name: 'Rent Payments', value: -180000, cumulative: 3490000, type: 'outflow' },
    { name: 'Salary Expenses', value: -450000, cumulative: 3040000, type: 'outflow' },
    { name: 'Vendor Payments', value: -280000, cumulative: 2760000, type: 'outflow' },
    { name: 'Tax Payments', value: -120000, cumulative: 2640000, type: 'outflow' },
    { name: 'Closing Balance', value: 2640000, cumulative: 2640000, type: 'closing' }
  ];

  const periods = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const getBarColor = (type) => {
    switch (type) {
      case 'opening': case'closing':
        return '#1e3a8a';
      case 'inflow':
        return '#10b981';
      case 'outflow':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatCurrency = (value) => {
    if (Math.abs(value) >= 10000000) {
      return `₹${(value / 10000000)?.toFixed(1)}Cr`;
    } else if (Math.abs(value) >= 100000) {
      return `₹${(value / 100000)?.toFixed(1)}L`;
    } else {
      return `₹${Math.abs(value)?.toLocaleString('en-IN')}`;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-4 financial-shadow-md">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-muted-foreground">Amount: </span>
              <span className={`font-medium ${data?.value >= 0 ? 'text-success' : 'text-error'}`}>
                {data?.value >= 0 ? '+' : ''}{formatCurrency(data?.value)}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Running Total: </span>
              <span className="font-medium text-foreground">{formatCurrency(data?.cumulative)}</span>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={() => onDrillDown && onDrillDown(data)}
          >
            View Details
          </Button>
        </div>
      );
    }
    return null;
  };

  const handlePeriodChange = async (period) => {
    setIsLoading(true);
    setSelectedPeriod(period);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 financial-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon name="BarChart3" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Cash Flow Waterfall</h3>
            <p className="text-sm text-muted-foreground">Track cash movement components</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {periods?.map((period) => (
            <Button
              key={period?.value}
              variant={selectedPeriod === period?.value ? "default" : "outline"}
              size="sm"
              onClick={() => handlePeriodChange(period?.value)}
              disabled={isLoading}
            >
              {period?.label}
            </Button>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            iconSize={16}
            className="ml-2"
          >
            Export
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">Loading waterfall data...</span>
          </div>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Cash Flow">
                {waterfallData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry?.type)} />
                ))}
              </Bar>
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#1e3a8a" 
                strokeWidth={2}
                dot={{ fill: '#1e3a8a', strokeWidth: 2, r: 4 }}
                name="Running Balance"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Total Inflows</div>
          <div className="text-lg font-semibold text-success">₹11.7L</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Total Outflows</div>
          <div className="text-lg font-semibold text-error">₹10.3L</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Net Change</div>
          <div className="text-lg font-semibold text-primary">₹1.4L</div>
        </div>
        <div className="text-center p-3 bg-amber-50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Efficiency</div>
          <div className="text-lg font-semibold text-warning">94.2%</div>
        </div>
      </div>
    </div>
  );
};

export default CashFlowWaterfall;