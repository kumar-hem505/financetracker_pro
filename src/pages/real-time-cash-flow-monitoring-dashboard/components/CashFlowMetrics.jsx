import React from 'react';
import Icon from '../../../components/AppIcon';

const CashFlowMetrics = ({ metrics, isLoading = false }) => {
  const metricCards = [
    {
      title: 'Current Cash Position',
      value: metrics?.currentCash,
      change: metrics?.cashChange,
      icon: 'Wallet',
      color: 'text-primary',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Daily Inflow',
      value: metrics?.dailyInflow,
      change: metrics?.inflowChange,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Daily Outflow',
      value: metrics?.dailyOutflow,
      change: metrics?.outflowChange,
      icon: 'TrendingDown',
      color: 'text-error',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Pending Receivables',
      value: metrics?.pendingReceivables,
      change: metrics?.receivablesChange,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-amber-50'
    }
  ];

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000)?.toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000)?.toFixed(1)}L`;
    } else {
      return `₹${amount?.toLocaleString('en-IN')}`;
    }
  };

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change?.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4]?.map((i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricCards?.map((metric, index) => (
        <div key={index} className="bg-card rounded-lg border border-border p-6 financial-shadow-sm hover:financial-shadow-md financial-transition">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${metric?.bgColor}`}>
              <Icon name={metric?.icon} size={24} className={metric?.color} />
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{metric?.title}</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-foreground">
                {formatCurrency(metric?.value)}
              </span>
              <span className={`text-sm font-medium ${
                metric?.change >= 0 ? 'text-success' : 'text-error'
              }`}>
                {formatChange(metric?.change)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CashFlowMetrics;