import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AccountsReceivableAging = ({ onViewDetails }) => {
  const [viewType, setViewType] = useState('bar');

  const agingData = [
    { period: '0-30 Days', amount: 1250000, count: 45, percentage: 42.5 },
    { period: '31-60 Days', amount: 850000, count: 28, percentage: 28.9 },
    { period: '61-90 Days', amount: 520000, count: 18, percentage: 17.7 },
    { period: '91-120 Days', amount: 280000, count: 12, percentage: 9.5 },
    { period: '120+ Days', amount: 95000, count: 8, percentage: 3.2 }
  ];

  const pieColors = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000)?.toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000)?.toFixed(1)}L`;
    } else {
      return `₹${value?.toLocaleString('en-IN')}`;
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
              <span className="font-medium text-foreground">{formatCurrency(data?.amount)}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Invoices: </span>
              <span className="font-medium text-foreground">{data?.count}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Percentage: </span>
              <span className="font-medium text-foreground">{data?.percentage}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 financial-shadow-md">
          <p className="font-medium text-popover-foreground">{data?.period}</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(data?.amount)} ({data?.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  const totalReceivables = agingData?.reduce((sum, item) => sum + item?.amount, 0);
  const overdueAmount = agingData?.slice(2)?.reduce((sum, item) => sum + item?.amount, 0);
  const overduePercentage = ((overdueAmount / totalReceivables) * 100)?.toFixed(1);

  return (
    <div className="bg-card rounded-lg border border-border p-6 financial-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-50 rounded-lg">
            <Icon name="Clock" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Accounts Receivable Aging</h3>
            <p className="text-sm text-muted-foreground">Outstanding invoice analysis by age</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewType === 'bar' ? "default" : "outline"}
            size="sm"
            iconName="BarChart3"
            iconSize={16}
            onClick={() => setViewType('bar')}
          >
            Bar
          </Button>
          <Button
            variant={viewType === 'pie' ? "default" : "outline"}
            size="sm"
            iconName="PieChart"
            iconSize={16}
            onClick={() => setViewType('pie')}
          >
            Pie
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="ExternalLink"
            iconSize={16}
            onClick={onViewDetails}
          >
            Details
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Total Receivables</div>
          <div className="text-xl font-bold text-primary">{formatCurrency(totalReceivables)}</div>
          <div className="text-xs text-muted-foreground mt-1">111 invoices</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Overdue Amount</div>
          <div className="text-xl font-bold text-error">{formatCurrency(overdueAmount)}</div>
          <div className="text-xs text-muted-foreground mt-1">{overduePercentage}% of total</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Collection Rate</div>
          <div className="text-xl font-bold text-success">87.3%</div>
          <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
        </div>
      </div>
      <div className="h-80">
        {viewType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="period" 
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
              <Bar dataKey="amount" name="Amount" radius={[4, 4, 0, 0]}>
                {agingData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors?.[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={agingData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="amount"
                label={({ period, percentage }) => `${period}: ${percentage}%`}
                labelLine={false}
              >
                {agingData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors?.[index]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        {agingData?.map((item, index) => (
          <div key={item?.period} className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: pieColors?.[index] }}
            ></div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-foreground truncate">{item?.period}</div>
              <div className="text-xs text-muted-foreground">{item?.count} invoices</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountsReceivableAging;