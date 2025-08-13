import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const GSTLiabilityChart = ({ data, chartType = 'bar' }) => {
  const monthlyData = [
    { month: 'Apr 2024', gst5: 45000, gst12: 78000, gst18: 125000, gst28: 32000, total: 280000 },
    { month: 'May 2024', gst5: 52000, gst12: 85000, gst18: 142000, gst28: 38000, total: 317000 },
    { month: 'Jun 2024', gst5: 48000, gst12: 92000, gst18: 156000, gst28: 45000, total: 341000 },
    { month: 'Jul 2024', gst5: 55000, gst12: 88000, gst18: 168000, gst28: 42000, total: 353000 },
    { month: 'Aug 2024', gst5: 61000, gst12: 95000, gst18: 175000, gst28: 48000, total: 379000 },
    { month: 'Sep 2024', gst5: 58000, gst12: 102000, gst18: 182000, gst28: 52000, total: 394000 }
  ];

  const taxRateData = [
    { name: '5% GST', value: 319000, color: '#10b981' },
    { name: '12% GST', value: 540000, color: '#3b82f6' },
    { name: '18% GST', value: 948000, color: '#f59e0b' },
    { name: '28% GST', value: 257000, color: '#ef4444' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 financial-shadow-md">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry?.color }}
                />
                <span className="text-sm text-muted-foreground">{entry?.name}:</span>
              </div>
              <span className="text-sm font-medium text-popover-foreground">
                ₹{entry?.value?.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartType === 'pie') {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">GST Liability by Tax Rate</h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taxRateData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100)?.toFixed(1)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {taxRateData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`₹${value?.toLocaleString('en-IN')}`, 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Monthly GST Liability Trends</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span className="text-muted-foreground">5% GST</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-muted-foreground">12% GST</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full" />
            <span className="text-muted-foreground">18% GST</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full" />
            <span className="text-muted-foreground">28% GST</span>
          </div>
        </div>
      </div>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `₹${(value / 1000)?.toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="gst5" name="5% GST" fill="#10b981" radius={[2, 2, 0, 0]} />
            <Bar dataKey="gst12" name="12% GST" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="gst18" name="18% GST" fill="#f59e0b" radius={[2, 2, 0, 0]} />
            <Bar dataKey="gst28" name="28% GST" fill="#ef4444" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GSTLiabilityChart;