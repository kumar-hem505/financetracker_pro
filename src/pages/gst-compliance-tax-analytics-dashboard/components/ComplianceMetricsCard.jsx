import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplianceMetricsCard = ({ title, value, subtitle, icon, trend, trendValue, color = "primary", deadline, status }) => {
  const getColorClasses = (colorType) => {
    const colors = {
      primary: "bg-primary text-primary-foreground",
      success: "bg-success text-success-foreground", 
      warning: "bg-warning text-warning-foreground",
      error: "bg-error text-error-foreground",
      accent: "bg-accent text-accent-foreground"
    };
    return colors?.[colorType] || colors?.primary;
  };

  const getTrendColor = (trendType) => {
    return trendType === 'up' ? 'text-success' : trendType === 'down' ? 'text-error' : 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 financial-shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${getColorClasses(color)}`}>
          <Icon name={icon} size={24} />
        </div>
        {status && (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            status === 'compliant' ? 'bg-success/10 text-success' :
            status === 'pending'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
          }`}>
            {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
        
        {trend && trendValue && (
          <div className="flex items-center space-x-2">
            <Icon 
              name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
              size={16} 
              className={getTrendColor(trend)}
            />
            <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
              {trendValue}
            </span>
          </div>
        )}
        
        {deadline && (
          <div className="flex items-center space-x-2 mt-3 p-2 bg-muted rounded-md">
            <Icon name="Clock" size={14} className="text-warning" />
            <span className="text-xs text-muted-foreground">Due: {deadline}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceMetricsCard;