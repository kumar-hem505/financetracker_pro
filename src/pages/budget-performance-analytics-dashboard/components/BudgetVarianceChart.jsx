import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const BudgetVarianceChart = ({ data, onCategoryClick }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const budgeted = payload?.find(p => p?.dataKey === 'budgeted')?.value || 0;
      const actual = payload?.find(p => p?.dataKey === 'actual')?.value || 0;
      const variance = ((actual - budgeted) / budgeted * 100)?.toFixed(1);
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 financial-shadow-md">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Budgeted:</span>
              <span className="font-medium">₹{budgeted?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Actual:</span>
              <span className="font-medium">₹{actual?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-border">
              <span className="text-muted-foreground">Variance:</span>
              <span className={`font-medium ${variance > 0 ? 'text-error' : 'text-success'}`}>
                {variance > 0 ? '+' : ''}{variance}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (entry) => {
    const variance = ((entry?.actual - entry?.budgeted) / entry?.budgeted) * 100;
    if (variance > 10) return '#dc2626'; // error
    if (variance > 0) return '#d97706'; // warning
    return '#059669'; // success
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 financial-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Budget vs Actual Spending</h3>
          <p className="text-sm text-muted-foreground mt-1">Click on categories for detailed breakdown</p>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary/60 rounded"></div>
            <span className="text-muted-foreground">Budgeted</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="text-muted-foreground">Actual</span>
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="category" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `₹${(value / 100000)?.toFixed(1)}L`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="budgeted" 
              fill="var(--color-primary)"
              opacity={0.6}
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="actual" 
              fill="var(--color-primary)"
              radius={[2, 2, 0, 0]}
              onClick={onCategoryClick}
              style={{ cursor: 'pointer' }}
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetVarianceChart;