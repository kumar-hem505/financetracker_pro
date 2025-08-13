import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialHealthScore = () => {
  const healthScore = 87;
  const previousScore = 82;
  const scoreChange = healthScore - previousScore;

  const healthMetrics = [
    {
      label: 'Liquidity Ratio',
      value: 2.3,
      status: 'excellent',
      description: 'Strong cash position'
    },
    {
      label: 'Debt-to-Equity',
      value: 0.4,
      status: 'good',
      description: 'Healthy debt levels'
    },
    {
      label: 'Profit Margin',
      value: 18,
      status: 'excellent',
      description: 'Above industry average'
    },
    {
      label: 'Cash Flow',
      value: 95,
      status: 'excellent',
      description: 'Consistent positive flow'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'text-success';
      case 'good':
        return 'text-accent';
      case 'warning':
        return 'text-warning';
      case 'poor':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
        return 'TrendingUp';
      case 'good':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'poor':
        return 'AlertCircle';
      default:
        return 'Minus';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border financial-shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Activity" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Financial Health Score</h3>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Brain" size={16} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">AI Powered</span>
        </div>
      </div>
      {/* Main Score Display */}
      <div className="text-center mb-6">
        <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
          {/* Background Circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted opacity-20"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(healthScore / 100) * 314} 314`}
              className="text-success financial-transition"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-foreground">{healthScore}</span>
            <span className="text-sm text-muted-foreground">Score</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <Icon
            name={scoreChange >= 0 ? 'TrendingUp' : 'TrendingDown'}
            size={16}
            className={scoreChange >= 0 ? 'text-success' : 'text-error'}
          />
          <span className={`text-sm font-medium ${scoreChange >= 0 ? 'text-success' : 'text-error'}`}>
            {scoreChange >= 0 ? '+' : ''}{scoreChange} points
          </span>
          <span className="text-sm text-muted-foreground">vs last month</span>
        </div>
      </div>
      {/* Health Metrics */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Key Metrics</h4>
        {healthMetrics?.map((metric, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon
                name={getStatusIcon(metric?.status)}
                size={16}
                className={getStatusColor(metric?.status)}
              />
              <div>
                <p className="text-sm font-medium text-foreground">{metric?.label}</p>
                <p className="text-xs text-muted-foreground">{metric?.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {metric?.label === 'Profit Margin' ? `${metric?.value}%` : metric?.value}
              </p>
              <p className={`text-xs font-medium ${getStatusColor(metric?.status)}`}>
                {metric?.status?.charAt(0)?.toUpperCase() + metric?.status?.slice(1)}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* AI Recommendations */}
      <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
        <div className="flex items-start space-x-2">
          <Icon name="Lightbulb" size={16} className="text-accent mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">AI Recommendation</p>
            <p className="text-xs text-muted-foreground">
              Your financial health is excellent. Consider investing surplus cash in growth opportunities 
              or expanding your emergency fund to 6 months of expenses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthScore;